const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const categoryRoute = require('./routes/categoryRoute');
const saleRoute = require('./routes/saleRoute');
const contactRoute = require('./routes/contactRoute');
const orderRoute = require('./routes/orderRoute');
const expenseRoute = require('./routes/expenseRoute');
const secretKeyRoute = require('./routes/secreteKeyRoute');
const errorHandler = require('./middleware/errorMiddleware');
const path = require('path');
const cookieParser = require('cookie-parser');



const app = express();

app.use(cors(
    {
        origin: ['http://localhost:3000', "https://addinventory.vercel.app"], 
        credentials: true
    }
));

//middleware
app.use(express.json());

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes
app.get('/', (req, res) => {
    res.send('Home page');
});
// route middleware
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/sales', saleRoute);
app.use('/api/contactUs', contactRoute);
app.use('/api/orders', orderRoute);
app.use('/api/expenses', expenseRoute);
app.use('/api/updatesecretkey', secretKeyRoute);

const port = process.env.PORT || 7001;

//error middleware
app.use(errorHandler);

//conect to mongoosedb
mongoose.connect(process.env.MONGO_URI) 
.then(() => {
    console.log('connected to db');
    app.listen(port, () => console.log(`server started on port ${port}`));
}).catch(err => console.log(err));

module.exports = app;