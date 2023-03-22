import express from 'express';

const router =  express.Router();

router.get('/', function(req, res) {
    res.send('Hola mundo');
});

router.get('/us', function(req, res) {
    res.send('Nosotros');
});

export default router;