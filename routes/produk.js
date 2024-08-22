const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Produk = require('../models/produk');

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Produk/'); // Folder to store uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, and JPG file formats are allowed!'));
        }
    }
});

// Create a new produk with image upload
router.post('/', upload.single('gambar'), async (req, res) => {
    try {
        const { nama, deskripsi, harga, fitur } = req.body;
        const gambar = req.file ? req.file.filename : null;

        const produk = await Produk.create({
            nama,
            deskripsi,
            harga,
            fitur,
            gambar
        });

        res.status(201).json(produk);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all produk
router.get('/', async (req, res) => {
    try {
        const produk = await Produk.findAll();
        res.status(200).json(produk);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get produk by ID
router.get('/:id', async (req, res) => {
    try {
        const produk = await Produk.findByPk(req.params.id);
        if (produk) {
            res.status(200).json(produk);
        } else {
            res.status(404).json({ error: 'Produk not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update produk by ID with image upload
router.put('/:id', upload.single('gambar'), async (req, res) => {
    try {
        const { nama, deskripsi, harga, fitur } = req.body;
        const gambar = req.file ? req.file.filename : null;

        const updatedData = { nama, deskripsi, harga, fitur };
        if (gambar) updatedData.gambar = gambar;

        const produk = await Produk.update(updatedData, {
            where: { id: req.params.id }
        });

        res.status(200).json(produk);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete produk by ID
router.delete('/:id', async (req, res) => {
    try {
        const produk = await Produk.findByPk(req.params.id);

        if (!produk) {
            return res.status(404).json({ error: 'Produk not found' });
        }

        // Delete the image file if it exists
        if (produk.gambar) {
            const filePath = path.join(__dirname, '..', 'uploads', produk.gambar);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Failed to delete image:', err);
                }
            });
        }

        // Delete the product from the database
        await Produk.destroy({
            where: { id: req.params.id }
        });

        res.status(200).json({ message: 'Produk deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
