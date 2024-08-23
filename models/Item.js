const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Item = sequelize.define('Item', {
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
    },
    kategori: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'Item'
});

module.exports = Item;
