const express = require('express');
const router = express.Router();
const Layanan = require('../models/Layanan');

// Create a new layanan
router.post('/', async (req, res) => {
    try {
        const layanan = await Layanan.create(req.body);
        res.status(201).json(layanan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all layanan
router.get('/', async (req, res) => {
    try {
        const layanan = await Layanan.findAll();
        res.status(200).json(layanan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get layanan by ID
router.get('/:id', async (req, res) => {
    try {
        const layanan = await Layanan.findByPk(req.params.id);
        if (layanan) {
            res.status(200).json(layanan);
        } else {
            res.status(404).json({ error: 'Layanan not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update layanan by ID
router.put('/:id', async (req, res) => {
    try {
        const layanan = await Layanan.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json(layanan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete layanan by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await Layanan.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({ message: 'Layanan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
