const express = require('express');
const router = express.Router();
const ServiceProposal = require('../models/ServiceProposal');
const auth = require('../middleware/auth').authenticateToken;

// Enviar proposta para serviço
router.post('/', auth, async (req, res) => {
  try {
    const proposal = await ServiceProposal.create({
      ...req.body,
      professional_id: req.user.id
    });
    res.json(proposal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar propostas de um serviço (contratante)
router.get('/service/:serviceId', auth, async (req, res) => {
  try {
    const proposals = await ServiceProposal.findByService(req.params.serviceId);
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar propostas do profissional
router.get('/my-proposals', auth, async (req, res) => {
  try {
    const proposals = await ServiceProposal.findByProfessional(req.user.id);
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aceitar/Rejeitar proposta
router.patch('/:id/status', auth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const proposal = await ServiceProposal.updateStatus(id, status, req.user.id);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposta não encontrada' });
    }
    res.json(proposal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

