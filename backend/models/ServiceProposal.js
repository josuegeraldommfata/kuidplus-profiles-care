const pool = require('../db');

// ServiceProposal Model
class ServiceProposal {
  static async create(data) {
    const { service_id, professional_id, amount, message } = data;
    const result = await pool.query(`
      INSERT INTO service_proposals (service_id, professional_id, status, amount, message)
      VALUES ($1, $2, 'pending', $3, $4)
      RETURNING *
    `, [service_id, professional_id, amount, message]);

    return result.rows[0];
  }

  static async findByService(serviceId) {
    const result = await pool.query(`
      SELECT sp.*, u.name, u.profession, AVG(r.rating) as professional_rating
      FROM service_proposals sp
      JOIN users u ON sp.professional_id = u.id
      LEFT JOIN reviews r ON u.id = r.professional_id
      WHERE sp.service_id = $1
      GROUP BY sp.id, u.name, u.profession
      ORDER BY sp.created_at DESC
    `, [serviceId]);

    return result.rows;
  }

  static async updateStatus(proposalId, status, professionalId) {
    const result = await pool.query(`
      UPDATE service_proposals
      SET status = $1
      WHERE id = $2 AND professional_id = $3
      RETURNING *
    `, [status, proposalId, professionalId]);

    return result.rows[0];
  }

  static async accept(proposalId) {
    const result = await pool.query(`
      UPDATE service_proposals
      SET status = 'accepted'
      WHERE id = $1
      RETURNING service_id, professional_id
    `, [proposalId]);

    if (result.rows.length > 0) {
      const { service_id } = result.rows[0];
      // Atualizar service status para 'assigned'
      await pool.query(
        'UPDATE services SET status = \'assigned\' WHERE id = $1',
        [service_id]
      );
    }

    return result.rows[0];
  }

  static async findByProfessional(professionalId) {
    const result = await pool.query(`
      SELECT sp.*, s.title as service_title, s.city, u.name as contractor_name
      FROM service_proposals sp
      JOIN services s ON sp.service_id = s.id
      JOIN users u ON s.contractor_id = u.id
      WHERE sp.professional_id = $1
      ORDER BY sp.created_at DESC
    `, [professionalId]);

    return result.rows;
  }
}

module.exports = ServiceProposal;

