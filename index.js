const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.ATLAS_URI
const PORT = process.env.PORT
const CORS_ORIGIN = process.env.CORS_ORIGIN

app.use(cors({origin:CORS_ORIGIN}))
app.use(express.json());


const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function sendVendors(res) {
    try {
        await client.connect();
        await client.db("Potluck").collection("Vendors").find({}).toArray().then((items) => {res.json(items)})
    } finally {
        await client.close();
    }
  }

  async function sendVendorsById(req, res) {
    try {
        let id = req.params.id
        await client.connect();
        await client.db("Potluck").collection("Vendors").find({_id : new ObjectId(id)}).toArray().then((items) => {res.json(items)})
    } finally {
        await client.close();
    }
  }

  async function updateVendorsById(req, res) {
    try {
        let id = req.params.id
        await client.connect();  
        delete req.body._id
        await client.db("Potluck").collection("Vendors").replaceOne({_id : new ObjectId(id)}, req.body)
        await res.sendStatus(200)
    } finally {
        await client.close();
    }
  }

  async function addOrder(req, res) {
    try {
        let id = req.params.id
        await client.connect();  
        await client.db("Potluck").collection("Vendors").updateOne({_id : new ObjectId(id)}, {$push:{"orders": req.body}})
        await res.sendStatus(200)
    } finally {
        await client.close();
    }
  }

  async function addItem(req, res) {
    try {
      let id = req.params.id
      await client.connect();  
      await client.db("Potluck").collection("Vendors").updateOne({_id : new ObjectId(id)}, {$push:{"items": req.body}})
      await res.sendStatus(200)
  } finally {
      await client.close();
  }
  }



app.get('/vendors', (req, res) => {
    sendVendors(res)
})

app.get('/vendors/:id', (req, res) => {
    sendVendorsById(req, res)
})

app.put('/vendors/:id', (req, res) => {
    updateVendorsById(req, res)
})

app.post('/vendors/:id/checkout', (req, res) => {
    addOrder(req, res)
})

app.post('/vendors/:id/item', (req, res) => {
  addItem(req, res)
})

app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
  });

            
