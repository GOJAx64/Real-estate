import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import userRoutes from './src/routes/userRoutes.js';
import db from './src/config/db.js';

const app = express();

//JSON read
app.use( express.urlencoded({ extended: true }) );

//Cookie parser
app.use(cookieParser());

//CSRF
app.use( csrf({ cookie: true }) );

//DB connection
try {
    await db.authenticate();
    db.sync();
    console.log('Connected database in localhost')
} catch (error) {
    console.log(error);
}

//PUG
app.set('view engine', 'pug');
app.set('views', './src/views');

//Public folder
app.use( express.static('public') )

// Routing
app.use('/auth', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at port: ${port}.`)
});