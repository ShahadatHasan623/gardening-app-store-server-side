const express =require('express')
const cors =require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app =express()
const port =process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

console.log(process.env.USER_DB,process.env.PASS_DB)
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.off1efx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    

  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("gardening store getting the server side")
})

app.listen(port,()=>{
    console.log(`server is running at:${port}`)
})