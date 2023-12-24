require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

require('./config/connection');

const port = process.env.PORT || 8080;

const passport = require('passport');

const AuthRoutes = require('./controllers/Auth/routes')
const UsersRoutes = require('./controllers/Users/routes');
const ServicesRoutes = require('./controllers/Services/routes');
const ProductsRoutes = require('./controllers/products/routes')
const BlogsRoutes = require('./controllers/Blog/routes')

app.use(cors({origin:true}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize())

const JwtStrategy = require('./middleware/passport-jwt')
JwtStrategy(passport);

app.use('/api/auth',AuthRoutes);
app.use('/api/users',UsersRoutes);
app.use('/api/service',ServicesRoutes);
app.use('/api/product',ProductsRoutes)
app.use('/api/blog',BlogsRoutes);

app.listen(port , ()=>{
    console.log('Server running on port ' + port);
});