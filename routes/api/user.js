const router = require('express').Router();
const { createToken } = require('../../helpers/utils');
const User = require('../../models/user.model');
const bcryptjs = require('bcryptjs');
const { checkToken } = require('../../helpers/middlewares');

router.get('/buy/:productoId', checkToken, async (req, res) => {
    const { productoId } = req.params;

    try {
        req.user.cart.push(productoId);
        const response = await req.user.save();
        res.json(response);

    } catch (err) {
        res.json({ fail: err.message });
    }
});

router.get('/cart', checkToken, async (req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        res.json({ fail: err.message });
    }
});

router.post('/register', async (req, res) => {

    const user = req.body;
    user.password = bcryptjs.hashSync(user.password, 8);

    try {
        const newUser = await User.create(user);
        res.json(newUser);
    } catch (err) {
        res.json({ fail: err.message });
    }
});

router.post('/login', async (req, res) => {

    try {
        const isUser = await User.findOne({ email: req.body.email });
        if (!isUser) {
            return res.json({ fail: 'Usuario o password incorrectos' });
        }

        const iguales = bcryptjs.compareSync(req.body.password, isUser.password);

        if (!iguales) {
            return res.json({ fail: 'Usuario o password incorrectos' });
        }

        res.json(
            {
                success: 'Login Correcto',
                token: createToken(isUser)
            }
        );
    } catch (err) {
        res.json({ fail: err.message });
    }
});

module.exports = router;