const mongoose = require("mongoose")



function connectToDb (){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Db is connected successfully...")
    })
}

module.exports = connectToDb