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
        const servicesCollection = database.collection("eventspotscost");

        // GET API
        app.get('/events', async (req, res) => {
            const cursor = servicesCollection.find({});
            // const services = await cursor.toArray();
            res.send(services);
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