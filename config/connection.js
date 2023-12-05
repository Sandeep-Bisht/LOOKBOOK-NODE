const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://negidpk866:k1BurHhZc3Oeeq5V@lookbookcluster.eixiriw.mongodb.net/?retryWrites=true&w=majority")
    .then((e)=> console.log("Connected to mongoDB"))
    .catch((e)=>console.log(e));


    // mongoose.connect("mongodb+srv://negidpk866:k1BurHhZc3Oeeq5V@lookbookcluster.eixiriw.mongodb.net/?retryWrites=true&w=majority")
