//Import the mongoose module
const mongoose = require("mongoose");

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set('strictQuery', false);

//Define the database URL to connect to.
const mongoDB = process.env.MONGO_URI;

//Connecting to mongoose.
async function mongooseConnect() {
    try {
        await mongoose.connect(mongoDB, {dbName: process.env.MONGODB1});
        console.log('MongoDB User database Connected through Mongoose');
        await mongoose.connect(mongoDB, {dbName: process.env.MONGODB2});
        console.log('MongoDB Blogs databse Connected through Mongoose')
    } catch (err) {
       throw err;
    }
}

module.exports ={
    mongooseConnect
};
