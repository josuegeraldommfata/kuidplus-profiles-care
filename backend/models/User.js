const pool = require('../db');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(userData) {
    const { email, password, role } = userData;
    const query = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *';
    const values = [email, password, role];

    try {
      const result = await pool.query(query, values);
      return new User(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  static async findAll() {
    const query = 'SELECT id, email, role, created_at, updated_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows.map(row => new User(row));
  }

  async update(updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return this;

    const query = `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    values.push(this.id);

    const result = await pool.query(query, values);
    Object.assign(this, result.rows[0]);
    return this;
  }

  async delete() {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [this.id]);
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
