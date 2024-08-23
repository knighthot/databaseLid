const express = require('express');
const bodyParser = require('body-parser');

const ItemRoutes = require('./routes/Item');

const app = express();

app.use(bodyParser.json());

app.use('/api/item', ItemRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
