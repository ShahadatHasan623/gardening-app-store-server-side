const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.off1efx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const gardenCollection = client.db("gardenDB").collection("garden");
    const exploreCollection = client.db("gardenersDB").collection("gardeners");

    app.post("/garden", async (req, res) => {
      const gardenUser = req.body;
      const result = await gardenCollection.insertOne(gardenUser);
      res.send(result);
    });

    app.get("/garden", async (req, res) => {
      const result = await gardenCollection.find().toArray();
      res.send(result);
    });

    app.get("/garden/home", async (req, res) => {
      const result = await gardenCollection.find().limit(6).toArray();
      res.send(result);
    });

    app.get("/garden/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gardenCollection.findOne(query);
      res.send(result);
    });

    // delete korbo
    app.delete("/garden/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await gardenCollection.deleteOne(filter);
      res.send(result);
    });

    // update Tip
    app.put("/garden/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateGarden = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: updateGarden,
      };
      const result = await gardenCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    //  Explore Gardeners:

    app.post("/gardeners", async (req, res) => {
      const gardeners = req.body;
      const result = await exploreCollection.insertOne(gardeners);
      res.send(result);
    });

    app.get("/gardeners", async (req, res) => {
      const result = await exploreCollection
        .find({ status: "active" })
        .limit(6)
        .toArray();
      res.send(result);
    });

    // top trending data
    app.post("/trending", async (req, res) => {
      const trending = req.body;
      const result = await trendingCollection.insertOne(trending);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("gardening store getting the server side");
});

app.listen(port, () => {
  console.log(`server is running at:${port}`);
});
