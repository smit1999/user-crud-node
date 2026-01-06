const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONN).then(()=>{
    console.log("DB connection successful")
});


module.exports = mongoose;