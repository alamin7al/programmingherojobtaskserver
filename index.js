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
  
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ow5x2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
async function run() {     
    try {   
        await client.connect()
        const database = client.db('watchList')
        const watchcollection = database.collection('watch')
        const detailsollection = database.collection('details')
        const revewsollection = database.collection('revew')
        const profileollection = database.collection('profile')


        app.get('/watch', async (req, res) => {
            const cursor = watchcollection.find({});
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


        app.post('/watch', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);

            const result = await watchcollection.insertOne(service);
            // console.log(result);
            res.send(result)
        });





        app.put('/watch/:id', async (req, res) => {
            const id = req.params.id
            const updateUser = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    title: updateUser.title,
                    price: updateUser.price,
                    desc: updateUser.desc,
                    rating: updateUser.rating,
                }
            }
            const result = await watchcollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        app.get('/watch/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const user = await watchcollection.findOne(query)
            res.send(user)
        })

        app.get('/single/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const user = await watchcollection.findOne(query)
            res.send(user)
        })




        app.get('/singleemail', async (req, res) => {
            const email = req.query.email
            // console.log(email);
            const query = { email: email }
            const cursor = detailsollection.find(query)
            const user = await cursor.toArray()
            res.json(user)
        })

        app.delete('/singleemail/:id', async (req, res) => {
            const id = req.params.id
            // console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await detailsollection.deleteOne(query)
            res.send(result)
        })
        app.post('/details', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);

            const result = await detailsollection.insertOne(service);
            res.send(result)
        });

        app.get('/details', async (req, res) => {
            const cursor = detailsollection.find({})
            const user = await cursor.toArray()
            res.send(user)
        })
        app.delete('/details/:id', async (req, res) => {
            const id = req.params.id
            const quarry = { _id: ObjectId(id) }
            const deleteData = await detailsollection.deleteOne(quarry)
            res.send(deleteData)

        })



        app.get('/revew', async (req, res) => {
            const cursor = revewsollection.find({})
            const user = await cursor.toArray()
            res.send(user)
        })
        app.post('/revew', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);

            const result = await revewsollection.insertOne(service);
            res.send(result)
        });


        app.post('/profile', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);

            const result = await profileollection.insertOne(service);
            console.log(result);
            res.send(result)
        });


        app.get('/profile', async (req, res) => {
            const email = req.query.email
            // console.log(email);
            const query = { email: email }
            const cursor = profileollection.find(query)
            const user = await cursor.toArray()
            res.json(user)
        })

        app.put('/profile/:id', async (req, res) => {
            const id = req.params.id
            const updateUser = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    phone: updateUser.phone,
                    price: updateUser.price,
                    city: updateUser.city,
                    email: updateUser.email,
                }
            }
            const result = await profileollection.updateOne(filter, updateDoc, options)
            console.log(result);
            res.send(result)
        })

        app.get('/profile/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const user = await profileollection.findOne(query)
            res.send(user)
        })





        console.log('hello');
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

