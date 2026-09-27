import { query } from '../config/database.js';

// Get donations for a case
export async function getDonationsByCase(req, res) {
  try {
    const { caseId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const donations = await query(
      `SELECT d.*, u.name as donor_name
       FROM donations d
       LEFT JOIN users u ON d.donor_id = u.id
       WHERE d.case_id = ?
       ORDER BY d.created_at DESC
       LIMIT ? OFFSET ?`,
      [caseId, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: {
        donations,
        count: donations.length
      }
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des dons'
    });
  }
}

// Get my donations (donor only)
export async function getMyDonations(req, res) {
  try {
    const donorId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    const donations = await query(
      `SELECT d.*, c.title as case_title, c.category
       FROM donations d
       LEFT JOIN cases c ON d.case_id = c.id
       WHERE d.donor_id = ?
       ORDER BY d.created_at DESC
       LIMIT ? OFFSET ?`,
      [donorId, parseInt(limit), parseInt(offset)]
    );

    // Get total donated amount
    const totalResult = await query(
      'SELECT SUM(amount) as total FROM donations WHERE donor_id = ?',
      [donorId]
    );

    res.json({
      success: true,
      data: {
        donations,
        count: donations.length,
        total_donated: totalResult[0].total || 0
      }
    });
  } catch (error) {
    console.error('Get my donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de vos dons'
    });
  }
}

// Create donation
export async function createDonation(req, res) {
  try {
    const { case_id, amount, message, is_anonymous = false } = req.body;
    const donorId = req.user.id;

    // Check if case exists
    const cases = await query('SELECT id, current_amount FROM cases WHERE id = ?', [case_id]);
    
    if (cases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cas non trouvé'
      });
    }

    // Insert donation
    const result = await query(
      'INSERT INTO donations (case_id, donor_id, amount, message, is_anonymous) VALUES (?, ?, ?, ?, ?)',
      [case_id, donorId, amount, message || null, is_anonymous ? 1 : 0]
    );

    // Update case current amount
    await query(
      'UPDATE cases SET current_amount = current_amount + ? WHERE id = ?',
      [amount, case_id]
    );

    res.status(201).json({
      success: true,
      message: 'Don enregistré avec succès',
      data: {
        donation_id: result.insertId
      }
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement du don'
    });
  }
}
