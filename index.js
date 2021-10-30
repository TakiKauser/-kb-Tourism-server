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
        const bookingCollection = database.collection("bookings");

        // GET Events
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

        // POST Event
        app.post('/event', async (req, res) => {
            console.log(req.body);
            const result = await eventsCollection.insertOne(req.body);
            console.log(result);
            res.send(result);
        });

        // POST Booking
        app.post('/event/booking', async (req, res) => {
            const result = await bookingCollection.insertOne(req.body);
            res.send(result);
        });

        // GET individual Bookings
        app.get('/myBookings/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: { $regex: email } };
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        });

        // GET all Bookings
        app.get('/manageAllBookings', async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.send(result);
        });

        // DELETE Booking
        app.delete('/myBookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })

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