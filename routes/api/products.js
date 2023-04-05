const router = require('express').Router();
const Product = require('../../models/product.model');

router.get('/', async (req, res) => {

    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.json({ fail: err.message });
    }

});



router.get('/price/:minPrice', async (req, res) => {
    const { minPrice } = req.params;

    try {
        const productos = await Product.find({
            //$gt, $gte, $lt, $lte, $eq, $neq, $in, $nin
            price: { $gte: minPrice }
            //available: true
        });
        res.json(productos);
    } catch (err) {
        res.json({ fail: err.message });
    }
});

router.get('/departamento/:department', async (req, res) => {
    const { department } = req.params;
    try {
        const product = await Product.find({
            department: department
        });

        res.json(product);
    } catch (err) {
        res.json({ fail: err.message });
    }
});

router.get('/:productID', async (req, res) => {

    try {
        const product = await Product.findById(req.params.productID);
        res.json(product);
    } catch (err) {
        res.json({ fail: err.message });
    }

});


router.post('/', async (req, res) => {

    try {
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (err) {
        res.json({ fail: err.message });
    }
});

router.put('/stock', async (req, res) => {
    try {
        const result = await Product.updateMany(
            {
                available: true,
                stock: { $lt: 10 }
            },
            {
                available: false
            }
        );

        res.json(result);
    } catch (err) {
        res.json({ fail: err.message });
    }
});

router.put('/:productID', async (req, res) => {
    const { productID } = req.params;
    try {
        const updateProduct = await Product.findByIdAndUpdate(productID, req.body, { new: true });
        res.json(updateProduct);
    } catch (err) {
        res.json({ fail: err.message });
    }
});

router.delete('/:productID', async (req, res) => {
    const { productID } = req.params;

    try {
        const productDeleted = await Product.findByIdAndDelete(productID);
        res.json(productDeleted);

    } catch (err) {
        res.json({ fail: err.message });
    }
});





module.exports = router;