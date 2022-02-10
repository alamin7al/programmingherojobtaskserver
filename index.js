const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const { query } = require('express');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// const uri = ` mongodb+srv://databse:HUfLi3LHdZNMXiOE@cluster0.ow5x2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority  `;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ow5x2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('programming')
        const foodCollection = database.collection("FoodItem");
        const studentCollection = database.collection("Student");
        const distributionCollection = database.collection("Distribution");

console.log('j');
        // Post Food API

        app.post('/foods', async (req, res) => {
            const result = await foodCollection.insertOne(req.body)
            res.send(result)
        })

        // Get all food api

        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let payload;
            const count = await cursor.count();

            if (page) {
                payload = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                payload = await cursor.toArray();
            }

            res.send({
                count,
                payload
            });
        }) 

        // get single food api
        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const payload = await foodCollection.findOne(query)
            res.send(payload)
        })

        // update food api
        app.put('/foods/:id', async (req, res) => {
            const cursor = req.body;
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = await { $set: { food: cursor.food, price: cursor.price } }
            const payload = await foodCollection.updateOne(query, updateDoc, options)
            res.send(payload)
        })

        // food delete api
        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await foodCollection.deleteOne(query)
            res.send(result)
        })

        // add student api 
        app.post('/students', async (req, res) => {
            const roll = req.body.roll;
            console.log(roll);
            const query = { roll: roll }
            const payload = await studentCollection.findOne(query)
            if (payload) {
                res.send(payload)
            }
            else {
                const result = await studentCollection.insertOne(req.body)
                res.send(result)
            }

        })

        // get all student 
        app.get('/students', async (req, res) => {
            const cursor = studentCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let payload;
            const count = await cursor.count();

            if (page) {
                payload = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                payload = await cursor.toArray();
            }

            res.send({
                count,
                payload
            });
        })

        // get single student
        app.get('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const payload = await studentCollection.findOne(query)
            res.send(payload)
        })


        // student update
        app.put('/students/:id', async (req, res) => {
            const student = req.body;
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = await { $set: { fullName: student.fullName, roll: student.roll, age: student.age, class: student.class, hall: student.hall } }
            const payload = await studentCollection.updateOne(query, updateDoc, options)
            res.send(payload)
        })

        // student status update api 
        app.put(`/student/:id`, async (req, res) => {
            const id = req.params.id
            const status = req.query.status;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = await { $set: { status: status } }
            const payload = await studentCollection.updateOne(query, updateDoc, options)
            res.send(payload)
        })

        // student delete api
        app.delete('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await studentCollection.deleteOne(query)
            res.send(result)
        })

        // food serve api
        app.post(`/food/serve`, async (req, res) => {
            const roll = req.body.studentId;
            const shift = req.body.shift;
            let today = new Date().toLocaleDateString()
            const query = { studentId: roll }
            const result = await distributionCollection.findOne(query)
            let payload;
            if (result?.date === today && result?.shift === shift) {
                res.send({ message: "Already served", statusCode: 404 })
            }
            else {
                payload = await distributionCollection.insertOne(req.body)
                res.send(payload)
            }
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running my CRUD Server');
});

app.listen(port, () => {
    console.log('Running Server on port', port);
})

