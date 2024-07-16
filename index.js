const express=require('express')
const cors=require('cors')
const jwt = require('jsonwebtoken');
const port=process.env.PORT||3000
const bcrypt=require('bcryptjs')
const { ObjectId } = require('mongodb');
const app=express()
require('dotenv').config()

//midleware

app.use(cors())
app.use(express.json())

app.get('/',async(req,res)=>{
    res.send('MFS server runngin')
})



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnsxsk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const userCollection=client.db("MFS").collection('user')
async function run() {
  try {
    app.post('/user',async(req,res)=>{
      const { name, password, number, email, role } = req.body;
      if(!name||!password||!number||!email||!role){
        res.status(404).send('All field are requerd')
      }
      const hashedPin = await bcrypt.hash(password, 10);
      const newUser={
        name,
        password:hashedPin,
        number,email,role
      }
      const result=await userCollection.insertOne(newUser)
      res.send(result)
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);



app.listen(port,()=>{
    console.log(`server runing on port ${port}`)
})