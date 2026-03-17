const pool = require('../db');

// Service Model
class Service {
  static async findOpen(city = null, profession = null, page = 1) {
    const limit = 12;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*, u.name as contractor_name,
             COUNT(sp.id) FILTER (WHERE sp.status = 'pending') as proposals_count,
             AVG(r.rating) as avg_rating
      FROM services s
      JOIN users u ON s.contractor_id = u.id
      LEFT JOIN service_proposals sp ON s.id = sp.service_id
      LEFT JOIN reviews r ON sp.professional_id = r.professional_id AND r.contractor_id = s.contractor_id
      WHERE s.status = 'open'
    `;
    let params = [], paramIndex = 1;

    if (city) {
      query += ` AND s.city ILIKE $${paramIndex++}`;
      params.push(`%${city}%`);
    }
    if (profession) {
      query += ` AND s.profession ILIKE $${paramIndex++}`;
      params.push(`%${profession}%`);
    }

    query += ` GROUP BY s.id, u.name ORDER BY s.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findByUser(contractorId) {
    const result = await pool.query(`
      SELECT s.*,
             COUNT(sp.id) as proposals_count,
             sp.status,
             p.professional_id,
             u.name as professional_name
      FROM services s
      LEFT JOIN service_proposals sp ON s.id = sp.service_id AND sp.status != 'rejected'
      LEFT JOIN users u ON sp.professional_id = u.id
      WHERE s.contractor_id = $1
      GROUP BY s.id, sp.status, p.professional_id, u.name
      ORDER BY s.created_at DESC
    `, [contractorId]);

    return result.rows;
  }

  static async create(data) {
    const { contractor_id, title, description, profession, city, budget_min, budget_max, deadline } = data;
    const result = await pool.query(`
      INSERT INTO services (contractor_id, title, description, profession, city, budget_min, budget_max, deadline, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'open')
      RETURNING *
    `, [contractor_id, title, description, profession, city, budget_min, budget_max, deadline]);

    return result.rows[0];
  }

  static async updateStatus(serviceId, status) {
    const result = await pool.query(
      'UPDATE services SET status = $1 WHERE id = $2 RETURNING *',
      [status, serviceId]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(`
      SELECT s.*, u.name as contractor_name
      FROM services s
      JOIN users u ON s.contractor_id = u.id
      WHERE s.id = $1
    `, [id]);
    return result.rows[0];
  }
}

module.exports = Service;

