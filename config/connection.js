const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_SRV || "mongodb+srv://semwalshubham18:tFo79XQiGI1R8kAU@devlookbook.7miulft.mongodb.net/?retryWrites=true&w=majority&appName=DevLookbook")
    .then((e)=> console.log(`Connected to mongoDB:${e.connection.host}`))
    .catch((e)=>console.log(e));