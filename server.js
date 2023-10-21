require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

require('./config/connection');

const port = process.env.PORT || 8080;
const routes = require('./routes/routes');

const passport = require('passport');

app.use(cors({origin:true}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize())

const JwtStrategy = require('./middleware/passport-jwt')
JwtStrategy(passport);

app.use('/api',routes);

app.listen(port , ()=>{
    console.log('Server running on port ' + port);
});