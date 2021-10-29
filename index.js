const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sydng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("tourism");
        const eventsCollection = database.collection("events");

        // GET API
        app.get('/events', async (req, res) => {
            const cursor = eventsCollection.find({});
            const events = await cursor.toArray();
            res.send(events);
        });

        // GET Single Event
        app.get('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const event = await eventsCollection.findOne(query);
            console.log(event);
            res.json(event);
        });

    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    console.log('Running kb-tourism!');
    res.send('Running kb-tourism!');
})

app.listen(port, () => {
    console.log(`kb-tourism is listening at http://localhost:${port}`);
})