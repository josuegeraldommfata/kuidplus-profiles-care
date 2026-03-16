const express = require('express');
const Review = require('../models/Review');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get reviews for a specific user (reviews received by this user)
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.findByReviewedId(userId);
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar avaliações' });
  }
});

// Get reviews given by a specific user
router.get('/given/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.findByReviewerId(userId);
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching given reviews:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar avaliações dadas' });
  }
});

// Get mutual reviews between two users
router.get('/mutual/:userId1/:userId2', authenticateToken, async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const reviews = await Review.findMutualReviews(userId1, userId2);
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching mutual reviews:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar avaliações mútuas' });
  }
});

// Create a new review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { reviewedId, rating, comment } = req.body;
    const reviewerId = req.user.id;

    // Check if user is trying to review themselves
    if (reviewerId === parseInt(reviewedId)) {
      return res.status(400).json({ success: false, message: 'Você não pode avaliar a si mesmo' });
    }

    // Check if review already exists
    const existingReviews = await Review.findMutualReviews(reviewerId, reviewedId);
    if (existingReviews.length > 0) {
      return res.status(400).json({ success: false, message: 'Você já avaliou este usuário' });
    }

    const review = await Review.create({
      reviewerId,
      reviewedId,
      rating: parseInt(rating),
      comment
    });

    res.status(201).json({ success: true, message: 'Avaliação criada com sucesso', review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar avaliação' });
  }
});

// Update a review
router.put('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Find the review
    const reviews = await Review.findByReviewerId(userId);
    const review = reviews.find(r => r.id === parseInt(reviewId));

    if (!review) {
      return res.status(404).json({ success: false, message: 'Avaliação não encontrada' });
    }

    const updatedReview = await review.update({
      rating: parseInt(rating),
      comment
    });

    res.json({ success: true, message: 'Avaliação atualizada com sucesso', review: updatedReview });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar avaliação' });
  }
});

// Delete a review
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Find the review
    const reviews = await Review.findByReviewerId(userId);
    const review = reviews.find(r => r.id === parseInt(reviewId));

    if (!review) {
      return res.status(404).json({ success: false, message: 'Avaliação não encontrada' });
    }

    await review.delete();

    res.json({ success: true, message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Erro ao deletar avaliação' });
  }
});

module.exports = router;
