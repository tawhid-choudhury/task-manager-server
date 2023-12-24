require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
const cors = require("cors");
// MIDDLE_WARES
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.woa6wff.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("todoDb");
    const taskCollection = database.collection("taskCollection");

    app.post("/addtask", async (req, res) => {
      console.log(req.body);
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      return res.send(result);
    });

    app.patch("/updateTask/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: false };
      const updatedTask = req.body;
      console.log(req.body);
      const task = {
        $set: {
          name: updatedTask.name,
          priority: updatedTask.priority,
          deadline: updatedTask.deadline,
          status: updatedTask.status,
          userEmail: updatedTask.userEmail,
        },
      };
      const result = await taskCollection.updateOne(filter, task, options);
      return res.send(result);
    });

    app.get("/all", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { userEmail: req.query.email };
      }
      const cursor = taskCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/all/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      return res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ToDO server");
});

app.listen(port, () => {
  console.log(`Server running on port no: ${port}`);
});
