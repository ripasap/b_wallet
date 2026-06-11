const mongoose = require("mongoose");

const mongodbPW = process.env.MONGO_PASSWORD;
const mongoUser = process.env.MONGO_USER;
const atlasPassword = encodeURIComponent(mongodbPW);
const atlasUri = `mongodb+srv://${mongoUser}:${atlasPassword}@cluster0.dx7tu59.mongodb.net/?appName=Cluster0`;
async function main() {
  try {
    await mongoose.connect(atlasUri, {
      dbName: "paytm"
    });
    console.log("WE'RE CONNECTED to Atlas")
  } catch (e) {
    console.log("OH NO! ERROR");
    console.log(e);
    process.exit(1);
  }
}

main();

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
    maxLength: 72
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 50
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);



const accountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
})

const Account = mongoose.model('Account', accountSchema);

module.exports = {
  User,
  Account
}



// const { MongoClient, ServerApiVersion } = require('mongodb');
// const { lowercase, minLength, maxLength } = require("zod");
// const uri = "mongodb+srv://ritsom2309_db_user:VduN35HPJHruAzyg@cluster0.afa8rps.mongodb.net/?appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
