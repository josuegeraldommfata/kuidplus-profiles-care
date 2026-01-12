const { pool } = require('../server');

class Professional {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.name = data.name;
    this.birthDate = data.birth_date;
    this.sex = data.sex;
    this.city = data.city;
    this.state = data.state;
    this.region = data.region;
    this.whatsapp = data.whatsapp;
    this.email = data.email;
    this.profession = data.profession;
    this.profileImage = data.profile_image;
    this.videoUrl = data.video_url;
    this.bio = data.bio;
    this.experienceYears = data.experience_years;
    this.courses = data.courses;
    this.certificates = data.certificates;
    this.serviceArea = data.service_area;
    this.serviceRadius = data.service_radius;
    this.hospitals = data.hospitals;
    this.availability = data.availability;
    this.priceRange = data.price_range;
    this.rating = data.rating;
    this.totalRatings = data.total_ratings;
    this.status = data.status;
    this.backgroundCheck = data.background_check;
    this.whatsappClicks = data.whatsapp_clicks;
    this.weeklyViews = data.weekly_views;
    this.createdAt = data.created_at;
    this.isHighlighted = data.is_highlighted;
    this.highlightPhrase = data.highlight_phrase;
    this.references = data.references;
    this.trialEndsAt = data.trial_ends_at;
  }

  static async create(professionalData) {
    const {
      userId, name, birthDate, sex, city, state, region, whatsapp, email,
      profession, profileImage, videoUrl, bio, experienceYears, courses,
      certificates, serviceArea, serviceRadius, hospitals, availability,
      priceRange, rating, totalRatings, status, backgroundCheck,
      whatsappClicks, weeklyViews, isHighlighted, highlightPhrase,
      references, trialEndsAt
    } = professionalData;

    const query = `
      INSERT INTO professionals (
        user_id, name, birth_date, sex, city, state, region, whatsapp, email,
        profession, profile_image, video_url, bio, experience_years, courses,
        certificates, service_area, service_radius, hospitals, availability,
        price_range, rating, total_ratings, status, background_check,
        whatsapp_clicks, weekly_views, is_highlighted, highlight_phrase,
        references, trial_ends_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
        $29, $30, $31
      ) RETURNING *
    `;
    const values = [
      userId, name, birthDate, sex, city, state, region, whatsapp, email,
      profession, profileImage, videoUrl, bio, experienceYears, JSON.stringify(courses),
      JSON.stringify(certificates), serviceArea, serviceRadius, JSON.stringify(hospitals),
      availability, JSON.stringify(priceRange), rating, totalRatings, status,
      backgroundCheck, whatsappClicks, weeklyViews, isHighlighted, highlightPhrase,
      JSON.stringify(references), trialEndsAt
    ];

    try {
      const result = await pool.query(query, values);
      return new Professional(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM professionals WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? new Professional(result.rows[0]) : null;
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM professionals WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0] ? new Professional(result.rows[0]) : null;
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM professionals WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.city) {
      query += ` AND city ILIKE $${paramCount}`;
      values.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.state) {
      query += ` AND state = $${paramCount}`;
      values.push(filters.state);
      paramCount++;
    }

    if (filters.profession) {
      query += ` AND profession = $${paramCount}`;
      values.push(filters.profession);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    query += ' ORDER BY is_highlighted DESC, rating DESC, created_at DESC';

    const result = await pool.query(query, values);
    return result.rows.map(row => new Professional(row));
  }

  async update(updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(Array.isArray(updateData[key]) || typeof updateData[key] === 'object'
          ? JSON.stringify(updateData[key])
          : updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return this;

    const query = `UPDATE professionals SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    values.push(this.id);

    const result = await pool.query(query, values);
    Object.assign(this, result.rows[0]);
    return this;
  }

  async delete() {
    const query = 'DELETE FROM professionals WHERE id = $1';
    await pool.query(query, [this.id]);
  }

  toJSON() {
    return {
      ...this,
      courses: JSON.parse(this.courses || '[]'),
      certificates: JSON.parse(this.certificates || '[]'),
      hospitals: JSON.parse(this.hospitals || '[]'),
      priceRange: JSON.parse(this.priceRange || '{}'),
      references: JSON.parse(this.references || '[]'),
    };
  }
}

module.exports = Professional;
