const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Layanan = sequelize.define('Layanan', {
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
    }
}, {
    tableName: 'layanan'
});

module.exports = Layanan;
