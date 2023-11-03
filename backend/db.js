const mongoose = require ('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/inotebook"

// const connectToMongo = ()=>{
//     mongoose.connect(mongoURI , ()=>{
//         console.log("connect to mongo Successfully");
//     })
// }

const connectToMongo= async () => {
    try {
          mongoose.connect(mongoURI) 
        console.log('Mongo connected')
    } catch(error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectToMongo;