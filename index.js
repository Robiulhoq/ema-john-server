const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const app = express()

app.use(bodyParser.json())
app.use(cors())
const port = 5000

console.log(process.env.DB_USER);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tx9ov.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err);
  const productsCollection = client.db("emaJohnStore").collection("products");
  const odderCollection = client.db("emaJohnStore").collection("odder");

  app.post('/addProducts', (req, res) =>{
      const product = req.body;
      console.log(product)
      productsCollection.insertMany(product)
      .then(result => {
        console.log(result)
          res.send(result)
      })
  })

  app.get('/products', (req, res) =>{
    productsCollection.find({}).limit(20)
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })


  app.get('/product/:key', (req, res) =>{
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) =>{
      res.send(documents[0])
    })
  })

  app.post('/productrsByKeys', (req, res) =>{
    const productsKeys = req.body;
    productsCollection.find({key: {$in: productsKeys}})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })
  console.log('database Connected');


  app.post('/odderProducts', (req, res) =>{
    const odder = req.body;
    odderCollection.insertOne(odder)
    .then(result => {
      console.log(result)
      console.log(result)
        res.send(result)
    })
})

  
});


console.log(process.env.DB_USER)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)