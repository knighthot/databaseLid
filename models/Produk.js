const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Produk = sequelize.define('Produk', {
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.TEXT
    },
    harga: {
        type: DataTypes.DECIMAL(10, 2)
    },
    fitur: {
        type: DataTypes.JSON
    },
    gambar: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'produk'
});

module.exports = Produk;
