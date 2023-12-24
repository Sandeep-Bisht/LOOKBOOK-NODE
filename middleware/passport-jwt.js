const { Strategy, ExtractJwt } =  require('passport-jwt')
const users = require('../models/Users')

module.exports = (passport) =>{
    passport.use(
        new Strategy({
            secretOrKey:process.env.JWT_KEY,
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        (jwt_payload,next) =>{

            users.findOne({_id:jwt_payload.userID})
            .then((result)=>{
                if(result){
                    next(null,result);
                }
                else{
                    next(null,false);
                }
            })
            .catch((error)=>{
                next(error,false);
            })
        }
        )
    )
}