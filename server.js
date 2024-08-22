const express = require('express');
const bodyParser = require('body-parser');
const layananRoutes = require('./routes/layanan');
const produkRoutes = require('./routes/Produk');

const app = express();

app.use(bodyParser.json());

app.use('/layanan', layananRoutes);
app.use('/produk', produkRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
