const pool = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const { country, industry, published } = req.query;
    let query = 'SELECT * FROM ev_case_studies WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (country) {
      query += ` AND country = $${paramCount}`;
      params.push(country);
      paramCount++;
    }
    if (industry) {
      query += ` AND industry = $${paramCount}`;
      params.push(industry);
      paramCount++;
    }
    if (published !== undefined) {
      query += ` AND is_published = $${paramCount}`;
      params.push(published === 'true');
      paramCount++;
    }

    query += ' ORDER BY date_published DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM ev_case_studies WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Case study not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, country, city, industry, organization, problem_statement, solution_implemented, 
            findings, pros, cons, recommendations, impact_metrics, date_published, author, 
            image_url, document_url, is_published } = req.body;

    const result = await pool.query(`
      INSERT INTO ev_case_studies (title, country, city, industry, organization, problem_statement, 
        solution_implemented, findings, pros, cons, recommendations, impact_metrics, date_published, 
        author, image_url, document_url, is_published)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [title, country, city, industry, organization, problem_statement, solution_implemented, 
        findings, pros, cons, recommendations, JSON.stringify(impact_metrics || {}), 
        date_published, author, image_url, document_url, is_published]);

    res.status(201).json({ success: true, message: 'Case study created successfully', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramCount}`);
        values.push(key === 'impact_metrics' ? JSON.stringify(req.body[key]) : req.body[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(req.params.id);
    const result = await pool.query(`UPDATE ev_case_studies SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Case study not found' });
    }
    res.json({ success: true, message: 'Case study updated successfully', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM ev_case_studies WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Case study not found' });
    }
    res.json({ success: true, message: 'Case study deleted successfully' });
  } catch (error) {
    next(error);
  }
};
