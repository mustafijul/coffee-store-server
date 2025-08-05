const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 4000;

// middleware

app.use(cors());
// .json() use na koray matha nosto kori laise ekbare
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqb0s9h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri);


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
        // making connection and creating DB in mongoDB
        const coffeeCollection = client.db('coffeeDB').collection('coffee');
        // making connection for user
        const userCollection = client.db('coffeeDB').collection('users');

        // reading or getting the data from DB
        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // updating info
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })

        // Creating user in mongoDB
        app.post('/coffee', async (req, res) => {
            const newCoffee = await req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result)
        })

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const Coffee = {
                $set: {
                    name: updatedCoffee.name,
                    quantity: updatedCoffee.quantity,
                    supplier: updatedCoffee.supplier,
                    taste: updatedCoffee.taste,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    photourl: updatedCoffee.photourl
                }
            }
            const result = await coffeeCollection.updateOne(filter, Coffee, options);
            res.send(result)

        })

        // Deleting info
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })


        // user api's

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log('new user  :', newUser);
            const result = await userCollection.insertOne(newUser);
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



app.get('/', (req, res) => {
    res.send("coffee making server running successfully alhamdulillah!")
})

app.listen(port, () => {
    console.log(`server running in port : ${port}`);

})