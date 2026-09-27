import { query } from '../config/database.js';

// Get all cases with filters
export async function getCases(req, res) {
  try {
    const { category, status = 'approved', search, isUrgent, limit = 20, offset = 0 } = req.query;

    let sql = `
      SELECT c.*, u.name as association_name, u.email as association_email
      FROM cases c
      LEFT JOIN users u ON c.association_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      sql += ' AND c.category = ?';
      params.push(category);
    }

    if (status) {
      sql += ' AND c.status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (c.title LIKE ? OR c.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (isUrgent !== undefined) {
      sql += ' AND c.is_urgent = ?';
      params.push(isUrgent === 'true' ? 1 : 0);
    }

    sql += ' ORDER BY c.is_urgent DESC, c.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const cases = await query(sql, params);

    // Get photos for each case
    for (let i = 0; i < cases.length; i++) {
      const photos = await query(
        'SELECT id, photo_url, display_order FROM case_photos WHERE case_id = ? ORDER BY display_order',
        [cases[i].id]
      );
      cases[i].photos = photos;
    }

    res.json({
      success: true,
      data: {
        cases,
        count: cases.length
      }
    });
  } catch (error) {
    console.error('Get cases error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des cas'
    });
  }
}

// Get single case by ID
export async function getCaseById(req, res) {
  try {
    const { id } = req.params;

    const cases = await query(
      `SELECT c.*, u.name as association_name, u.email as association_email, u.phone as association_phone
       FROM cases c
       LEFT JOIN users u ON c.association_id = u.id
       WHERE c.id = ?`,
      [id]
    );

    if (cases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cas social non trouvé'
      });
    }

    const caseData = cases[0];

    // Get photos
    const photos = await query(
      'SELECT id, photo_url, display_order FROM case_photos WHERE case_id = ? ORDER BY display_order',
      [id]
    );
    caseData.photos = photos;

    // Get recent donations
    const donations = await query(
      `SELECT d.*, u.name as donor_name
       FROM donations d
       LEFT JOIN users u ON d.donor_id = u.id
       WHERE d.case_id = ?
       ORDER BY d.created_at DESC
       LIMIT 10`,
      [id]
    );
    caseData.recent_donations = donations;

    // Increment view count
    await query('UPDATE cases SET view_count = view_count + 1 WHERE id = ?', [id]);
    await query('INSERT INTO case_views (case_id) VALUES (?)', [id]);

    res.json({
      success: true,
      data: {
        case: caseData
      }
    });
  } catch (error) {
    console.error('Get case by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du cas'
    });
  }
}

// Create new case (associations and admins only)
export async function createCase(req, res) {
  try {
    const {
      title,
      description,
      category,
      cha9a9a_link,
      target_amount,
      is_urgent = false
    } = req.body;

    const associationId = req.user.id;

    // Insert case
    const result = await query(
      `INSERT INTO cases (title, description, category, cha9a9a_link, target_amount, is_urgent, association_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, category, cha9a9a_link, target_amount, is_urgent ? 1 : 0, associationId, 'pending']
    );

    const caseId = result.insertId;

    // Handle photo uploads if any
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const photoUrl = `/uploads/${file.filename}`;
        
        await query(
          'INSERT INTO case_photos (case_id, photo_url, photo_path, display_order) VALUES (?, ?, ?, ?)',
          [caseId, photoUrl, file.path, i]
        );
      }
    }

    // Get created case
    const cases = await query(
      'SELECT * FROM cases WHERE id = ?',
      [caseId]
    );

    res.status(201).json({
      success: true,
      message: 'Cas créé avec succès (en attente de validation)',
      data: {
        case: cases[0]
      }
    });
  } catch (error) {
    console.error('Create case error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du cas'
    });
  }
}

// Update case (own cases for associations, all for admins)
export async function updateCase(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      cha9a9a_link,
      target_amount,
      is_urgent,
      status
    } = req.body;

    // Check ownership
    const cases = await query('SELECT association_id FROM cases WHERE id = ?', [id]);
    
    if (cases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cas non trouvé'
      });
    }

    if (req.user.role !== 'admin' && cases[0].association_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier ce cas'
      });
    }

    // Build update query
    const updates = [];
    const values = [];

    if (title) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description) {
      updates.push('description = ?');
      values.push(description);
    }
    if (category) {
      updates.push('category = ?');
      values.push(category);
    }
    if (cha9a9a_link) {
      updates.push('cha9a9a_link = ?');
      values.push(cha9a9a_link);
    }
    if (target_amount) {
      updates.push('target_amount = ?');
      values.push(target_amount);
    }
    if (is_urgent !== undefined) {
      updates.push('is_urgent = ?');
      values.push(is_urgent ? 1 : 0);
    }
    if (status && req.user.role === 'admin') {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }

    values.push(id);

    await query(
      `UPDATE cases SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated case
    const updatedCases = await query('SELECT * FROM cases WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Cas mis à jour avec succès',
      data: {
        case: updatedCases[0]
      }
    });
  } catch (error) {
    console.error('Update case error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du cas'
    });
  }
}

// Delete case (own cases for associations, all for admins)
export async function deleteCase(req, res) {
  try {
    const { id } = req.params;

    // Check ownership
    const cases = await query('SELECT association_id FROM cases WHERE id = ?', [id]);
    
    if (cases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cas non trouvé'
      });
    }

    if (req.user.role !== 'admin' && cases[0].association_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer ce cas'
      });
    }

    // Delete case (cascade will delete photos, donations, etc.)
    await query('DELETE FROM cases WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Cas supprimé avec succès'
    });
  } catch (error) {
    console.error('Delete case error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du cas'
    });
  }
}

// Get cases by association
export async function getMyCases(req, res) {
  try {
    const associationId = req.user.id;

    const cases = await query(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM donations WHERE case_id = c.id) as donation_count
       FROM cases c
       WHERE c.association_id = ?
       ORDER BY c.created_at DESC`,
      [associationId]
    );

    // Get photos for each case
    for (let i = 0; i < cases.length; i++) {
      const photos = await query(
        'SELECT id, photo_url, display_order FROM case_photos WHERE case_id = ? ORDER BY display_order',
        [cases[i].id]
      );
      cases[i].photos = photos;
    }

    res.json({
      success: true,
      data: {
        cases,
        count: cases.length
      }
    });
  } catch (error) {
    console.error('Get my cases error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de vos cas'
    });
  }
}
