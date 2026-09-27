const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs'); 


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });


const dataFile = './products.json';


function getProducts() {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
      
        return []; 
    }
}

function saveProducts(products) {
    fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
}

//product routes

router.get('/', (req, res) => {
    const products = getProducts();
    const queryId = req.query.id;
    
    if (queryId) {
        const product = products.find(p => p.id === queryId);
        return res.json(product || { message: "Product not found" });
    }
    res.json(products);
});

router.post('/', upload.single('img'), (req, res) => {
    const products = getProducts(); // Read current data
    
    const newProduct = {
        id: Date.now().toString(),
        ...req.body,
        imagePath: req.file ? req.file.path : "No image uploaded"
    };
    
    products.push(newProduct);
    saveProducts(products); 
    
    res.json({ message: "Product created", product: newProduct });
});

router.delete('/:id', (req, res) => {
    let products = getProducts(); 
    const paramId = req.params.id;
    
    products = products.filter(p => p.id !== paramId);
    saveProducts(products); 
    
    res.json({ message: `Product ${paramId} deleted` });
});

// PUT route (Updates an existing product)
router.put('/:id', upload.single('img'), (req, res) => {
    let products = getProducts(); 
    const paramId = req.params.id;
    
   
    const productIndex = products.findIndex(p => p.id === paramId);
    
   
    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

   
    const updatedProduct = {
        ...products[productIndex], 
        ...req.body               
    };

   
    if (req.file) {
        updatedProduct.imagePath = req.file.path;
    }

    products[productIndex] = updatedProduct;
    saveProducts(products); 
    
    res.json({ message: `Product ${paramId} updated`, product: updatedProduct });
});


module.exports = router;