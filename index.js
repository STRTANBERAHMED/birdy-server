const express = require('express');
const cors = require("cors");
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gezhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('birdy')
        const servicesCollection = database.collection('services');
        // const orderCollection = database.collection('placeOrders');


        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('str', service);

            const result = await servicesCollection.insertOne(service);
            res.json(result);

            console.log(result)
        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello bro from my help hand server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})