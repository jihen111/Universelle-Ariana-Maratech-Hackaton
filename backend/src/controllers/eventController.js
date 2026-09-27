import { query } from '../config/database.js';

// Get all events
export async function getEvents(req, res) {
  try {
    const { limit = 20, offset = 0, upcoming = true } = req.query;

    let sql = `
      SELECT e.*, u.name as association_name
      FROM events e
      LEFT JOIN users u ON e.association_id = u.id
    `;

    const params = [];

    if (upcoming === 'true') {
      sql += ' WHERE e.event_date >= NOW()';
    }

    sql += ' ORDER BY e.event_date ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const events = await query(sql, params);

    res.json({
      success: true,
      data: {
        events,
        count: events.length
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements'
    });
  }
}

// Get event by ID
export async function getEventById(req, res) {
  try {
    const { id } = req.params;

    const events = await query(
      `SELECT e.*, u.name as association_name, u.email as association_email, u.phone as association_phone
       FROM events e
       LEFT JOIN users u ON e.association_id = u.id
       WHERE e.id = ?`,
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    res.json({
      success: true,
      data: {
        event: events[0]
      }
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'événement'
    });
  }
}

// Create event (associations and admins only)
export async function createEvent(req, res) {
  try {
    const { title, description, event_date, location } = req.body;
    const associationId = req.user.id;

    let image_url = null;
    let image_path = null;

    // Handle image upload if any
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
      image_path = req.file.path;
    }

    // Insert event
    const result = await query(
      `INSERT INTO events (title, description, event_date, location, image_url, image_path, association_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, event_date, location, image_url, image_path, associationId]
    );

    // Get created event
    const events = await query('SELECT * FROM events WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Événement créé avec succès',
      data: {
        event: events[0]
      }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'événement'
    });
  }
}

// Update event
export async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const { title, description, event_date, location } = req.body;

    // Check ownership
    const events = await query('SELECT association_id FROM events WHERE id = ?', [id]);
    
    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    if (req.user.role !== 'admin' && events[0].association_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier cet événement'
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
    if (event_date) {
      updates.push('event_date = ?');
      values.push(event_date);
    }
    if (location) {
      updates.push('location = ?');
      values.push(location);
    }

    // Handle image upload if any
    if (req.file) {
      updates.push('image_url = ?', 'image_path = ?');
      values.push(`/uploads/${req.file.filename}`, req.file.path);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }

    values.push(id);

    await query(
      `UPDATE events SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated event
    const updatedEvents = await query('SELECT * FROM events WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Événement mis à jour avec succès',
      data: {
        event: updatedEvents[0]
      }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'événement'
    });
  }
}

// Delete event
export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    // Check ownership
    const events = await query('SELECT association_id FROM events WHERE id = ?', [id]);
    
    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    if (req.user.role !== 'admin' && events[0].association_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer cet événement'
      });
    }

    // Delete event
    await query('DELETE FROM events WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Événement supprimé avec succès'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'événement'
    });
  }
}
