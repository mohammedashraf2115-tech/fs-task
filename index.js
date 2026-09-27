const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productsRouter = require('./products');
app.use('/products', productsRouter);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});