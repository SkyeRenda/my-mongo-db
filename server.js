const bodyParser= require('body-parser')
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient

const MONGO_CONNECTION = 'mongodb+srv://skyerenda:xUr5fIJH0UmVXSkP@cluster0.0jzkljb.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(MONGO_CONNECTION, { useUnifiedTopology: true })
.then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    app.set('view engine', 'ejs')
    app.use(bodyParser.json())
    app.use(express.static('public'))

    // Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.urlencoded({ extended: true }))

    // We normally abbreviate `request` to `req` and `response` to `res`.
    app.get('/', (req, res) => {
                
        db.collection('quotes').find().toArray()
        .then(results => {
            res.render('index.ejs', { quotes : results })
        })
        .catch(error=> console.error(error))
        
    })

    app.post('/quotes', (req, res) => {
        console.log(req.body)
        quotesCollection.insertOne(req.body)
        .then(result => {
            res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    app.listen(3000, function() {
        console.log('listening on 3000')
      })

    app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
            {   name: 'Yoda'},
            {
                $set: {
                  name: req.body.name,
                  quote: req.body.quote
                }
            },
            {
                   upsert: true
            }
          )
        .then(result => {
            res.json('Success') 
            })
        .catch(error => console.error(error))
    })
    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
            {name : req.body.name},
            
          )
          .then(result => {
            if (result.deletedCount === 0) {
              return res.json('No quote to delete')
            }
            res.json("Deleted darth vader's quote")
        })
            .catch(error => console.error(error))
    })
    
})
.catch(console.error)




