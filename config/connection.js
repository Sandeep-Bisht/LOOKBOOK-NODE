const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_SRV || "mongodb+srv://semwalshubham18:4VcVRdAzCOUWBdlj@lookbook.bylr1x3.mongodb.net/?retryWrites=true&w=majority")
    .then((e)=> console.log(`Connected to mongoDB:${e.connection.host}`))
    .catch((e)=>console.log(e));