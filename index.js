const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

const app =express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.l9yjteg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const ToysCollection =  client.db('ToysDB').collection('ToysCollection')

    app.get('/toys/:category',async(req,res)=>{
        const subCategory = req.params.category;
        console.log(subCategory);
        const query = { category: subCategory };
        const result = await ToysCollection.find(query).toArray()
        res.send(result)
    })

    app.get('/allToy',async(req,res)=>{
      console.log(req.query);
      const limitCount = req.query.limit;
        const result = await ToysCollection.find().limit(parseInt(limitCount)).toArray();
        res.send(result)
    })

    app.get('/searchToy/:text',async(req,res)=>{
      const limitCount = req.query.limit;
      const text = req.params.text;
      const result = await ToysCollection.find({ ToyName: { $regex:text, $options: "i" } }).limit(parseInt(limitCount)).toArray();
      res.send(result)
    })

    app.post('/addToy',async(req,res)=>{
        const data = req.body
        const result = await ToysCollection.insertOne(data)
        res.send(result)
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



app.get('/',(req,res)=>{
    res.send('Toy shop server is running')
})

app.listen(port,()=>{
    console.log('toy server is running on port',port)
})