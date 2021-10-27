const {MongoClient, ObjectID} = require('mongodb')
const express = require('express')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const app = express()
const port = process.env.PORT || 4000

// MiddleWire
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z46cs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const run = async () => {
   try{
      await client.connect();
      
      const database = client.db('carMechanics')
      const servicesCollection = database.collection('services')

      // GET all services API
      app.get('/services', async (req, res) => {
         const cursor = servicesCollection.find({})
         const services = await cursor.toArray()
         res.send(services)
      })

      // GET specific service API
      app.get('/services/:id', async (req, res) => {
         const id = req.params.id
         console.log(id)
         const query = {_id: ObjectId(id)}
         const result = await servicesCollection.findOne(query)
         console.log(result)
         res.send(result)
      })

      // POST API
      app.post('/services', async (req, res) => {
         const service = req.body
         const result = await servicesCollection.insertOne(service)
         res.send(result)
      })

      // Delete single service API
      app.delete('/services/:id', async(req, res) => {
         const id = req.params.id
         const query = {_id: ObjectId(id)}
         const result = await servicesCollection.deleteOne(query)
         res.send(result)
      })

   } finally{
      // await client.close();
   }
}
run().catch(console.dir)


app.get('/', (req, res) => {
   console.log(uri)
   res.send('Project is working well!')
})


app.listen(port, (req, res) => {
   console.log('This server is running at port no: ', port)
})
