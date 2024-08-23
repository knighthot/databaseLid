const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Item = require('../models/Item');

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
    limits: { fileSize: 1024 * 1024 * 10 }, // Limit file size to 10MB
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

// Create a new item with image upload
router.post('/', upload.single('gambar'), async (req, res) => {
    try {
        const { nama, deskripsi, harga, fitur, kategori } = req.body;
        const gambar = req.file ? req.file.filename : null;

        const item = await Item.create({
            nama,
            deskripsi,
            harga,
            fitur,
            gambar,
            kategori
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.findAll();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update item by ID with image upload
router.put('/:id', upload.single('gambar'), async (req, res) => {
    try {
        const { nama, deskripsi, harga, fitur, kategori } = req.body;
        const gambar = req.file ? req.file.filename : null;

        const updatedData = { nama, deskripsi, harga, fitur, kategori };
        if (gambar) updatedData.gambar = gambar;

        const item = await Item.update(updatedData, {
            where: { id: req.params.id }
        });

        if (item[0] > 0) {
            res.status(200).json({ message: 'Item updated successfully' });
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete item by ID
router.delete('/:id', async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Delete the image file if it exists
        if (item.gambar) {
            const filePath = path.join(__dirname, '..', 'Produk', item.gambar);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Failed to delete image:', err);
                }
            });
        }

        // Delete the item from the database
        await Item.destroy({
            where: { id: req.params.id }
        });

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
