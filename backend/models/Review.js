const pool = require('../db');

class Review {
  constructor(data) {
    this.id = data.id;
    this.reviewerId = data.reviewer_id;
    this.reviewedId = data.reviewed_id;
    this.rating = data.rating;
    this.comment = data.comment;
    this.createdAt = data.created_at;
  }

  static async create(reviewData) {
    const { reviewerId, reviewedId, rating, comment } = reviewData;
    const query = `
      INSERT INTO reviews (reviewer_id, reviewed_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [reviewerId, reviewedId, rating, comment];

    try {
      const result = await pool.query(query, values);
      return new Review(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async findByReviewedId(reviewedId) {
    const query = `
      SELECT r.*, u.name as reviewer_name, u.role as reviewer_role
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.reviewed_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [reviewedId]);
    return result.rows.map(row => ({
      ...row,
      reviewer_name: row.reviewer_name,
      reviewer_role: row.reviewer_role
    }));
  }

  static async findByReviewerId(reviewerId) {
    const query = 'SELECT * FROM reviews WHERE reviewer_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [reviewerId]);
    return result.rows.map(row => new Review(row));
  }

  static async findById(id) {
    const query = 'SELECT * FROM reviews WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? new Review(result.rows[0]) : null;
  }

  async update(updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return this;

    const query = `UPDATE reviews SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    values.push(this.id);

    const result = await pool.query(query, values);
    Object.assign(this, result.rows[0]);
    return this;
  }

  async delete() {
    const query = 'DELETE FROM reviews WHERE id = $1';
    await pool.query(query, [this.id]);
  }

  toJSON() {
    return {
      id: this.id,
      reviewerId: this.reviewerId,
      reviewedId: this.reviewedId,
      rating: this.rating,
      comment: this.comment,
      createdAt: this.createdAt
    };
  }
}

module.exports = Review;
