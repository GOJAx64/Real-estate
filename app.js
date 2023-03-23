import express from 'express';
import userRoutes from './src/routes/userRoutes.js';

const app = express();

//PUG
app.set('view engine', 'pug');
app.set('views', './src/views');

//Public folder
app.use( express.static('public') )

// Routing
app.use('/auth', userRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at port: ${port}.`)
});