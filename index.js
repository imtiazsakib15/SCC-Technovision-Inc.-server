const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r7tkdvs.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const usersCollection = client.db("Scc-Tech").collection("users");
    const tasksCollection = client.db("Scc-Tech").collection("tasks");

    // Get all tasks of a user from database
    app.get("/tasks/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email };
        const result = (await tasksCollection.find(query).toArray()) || [];
        res.send(result);
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .send({ success: false, error: "Internal Server Error" });
      }
    });

    //   Post users to database
    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ success: false, error: "Internal Server Error" });
      }
    });
    // post tasks to database
    app.post("/tasks", async (req, res) => {
      try {
        const task = req.body;
        const result = await tasksCollection.insertOne(task);
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ success: false, error: "Internal Server Error" });
      }
    });

    // Delete a task from database
    app.delete("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await tasksCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .send({ success: false, error: "Internal Server Error" });
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Scc  listening on port ${port}`);
});
