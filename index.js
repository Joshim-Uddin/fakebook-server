const express= require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

/**
 * database configuration
 */

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.x5isz8r.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const usersCollection = client.db('fakebookDB').collection('users');

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    app.get('/login', async(req, res) => {
        const mobileEmail = req.query.mobileEmail;
        const password = req.query.password;
        const existingUser = await usersCollection.findOne({mobileEmail: mobileEmail})
        // console.log(existingUser)

        if(existingUser?.password!== password){
          res.send({failed: true, message:"Email and Password doesn't match"})
        }else{
          res.send(existingUser);
        }
    })
    app.post('/signup', async(req, res) => {
        const user = req.body;
        const existingUser = await usersCollection.findOne({mobileEmail: user.mobileEmail})
        if(existingUser){
          res.send({failed: true, message:"User already exists"})
        }else{
          const result = await usersCollection.insertOne(user);
          res.send(result);
        }
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


/**
 * Database endpoint configuration
 */
app.get('/', (req, res) => {
    res.send('Server running')
})
app.listen(port, ()=>{
    console.log(`server running ${port}`)
})