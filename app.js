import express from 'express';
import userRoutes from './src/routes/userRoutes.js'
const app = express();

// Routing
app.use('/', userRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at port: ${port}.`)
});