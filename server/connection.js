
const app = require('../application.js')

app.listen(3000,(err)=>{
    if (err){
        console.error(err)
        process.exit(1);
    }
    else{
        console.log('server listening on port 3001')
    }
});



