const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4rme0sq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



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
    
    

    const coffeeCollection = client.db("coffeeDB").collection("coffeeCollection")

    app.get('/addCoffee',async(req,res)=>{
      const cursor = coffeeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/addCoffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      console.log(id,result);
      res.send(result)
    })

    app.post('/addCoffee', async(req, res) => {
      const addCoffee = req.body;
      const result = await coffeeCollection.insertOne(addCoffee)
      res.send(result)
    })

    app.delete('/addCoffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })

    app.put('/addCoffee/:id',async(req,res)=>{
      const id = req.params.id;
      const coffee = req.body;
      console.log(coffee);
      const filter = {_id : new ObjectId(id)}
      const options = {upsert: true};
      const updateCoffee= {
        $set: {
          name : coffee.name,
          chefName: coffee.chefName,
          supplier : coffee.supplier,
          category : coffee.category,
          details : coffee.details,
          taste : coffee.taste,
          photoUrl : coffee.photoUrl
        }
      }
      const result = await coffeeCollection.updateOne(filter,updateCoffee,options)
      res.send(result)
    })

    // const id = req.params.id;
    //   const user = req.body;
    //   console.log(user,id);
    //   const filter = {_id : new ObjectId(id)}
    //   const options = {upsert: true}
    //   const updateUser = {
    //     $set : {
    //       name: user.name,
    //       email : user.email
    //     }
    //   }
    //   const result = await userCollection.updateOne(filter,updateUser,options);
    //   res.send(result)

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Coffee server is running');
})

app.listen(port, () => {
  console.log(`coffee server is running in port ${port}`);
})