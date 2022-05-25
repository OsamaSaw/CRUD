const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient


const app = express()
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.json())


app.use(bodyParser.urlencoded({ extended: true }))
app.listen(5000, () => {
  console.log("Server Connected")
})


connectionString = 'mongodb+srv://osama:osama123@cluster0.rmwz7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    // Main Page -- still empty 
    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(results => {
          res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.error(error))

    })


    // Create Post page -- form
    app.get('/createquote', async (req, res) => {

      res.sendFile(__dirname + '/createQuotes.html')
    })

    // Create Post req -- POSt Req
    app.post('/creatingpost', async (req, res) => {
      req.body.name = req.body.name.replace(/\s+/g, ' ')
      req.body.quote = req.body.quote.replace(/\s+/g, ' ')
      let newReqBody = trimDis(req.body)
      console.log(req.body.name, req.body.quote)

      quotesCollection.insertOne(newReqBody)
        .then(result => {
          // console.log(result)
          res.redirect('/')
        })
        .catch(error => console.error(error))

    })

    app.put('/creatingpost', (req, res) => {

      req.body.newq = req.body.newq.replace(/\s+/g, ' ')
      let newReqQ = trimOne(req.body)

      quotesCollection.findOneAndUpdate(
        { quote: req.body.oldq },
        {
          $set: {
            quote: newReqQ.quote
          }
        },
        {
          upsert: true
        }
      )
      console.log(req.body.oldq, req.body.newq)
        .then(result => {
          res.json('Success')
        })
        .catch(error => console.error(error))

    })

    app.delete('/creatingpost', (req, res) => {
      quotesCollection.deleteOne(
        { quote: req.body.quote }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json(`Quote deleted `)
        })
        .catch(error => console.error(error))




    })


  })
  .catch(console.error);


function trimDis(obj) {
  let theNewQA = {
    name: obj.name.trim(),
    quote: obj.quote.trim()
  }

  console.log(obj)
  console.log(theNewQA)

  return theNewQA

}

function trimOne(obj) {
  let theNewQ = {
    quote: obj.newq.trim()
  }
  return theNewQ
}