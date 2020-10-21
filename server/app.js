const db = require('./database/index.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Product = require('./database/Carousel.js');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use('/listing', express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use(cors());

// Need to add in rest of the CRUD verbs
app.get('/listing/*', (req, res) => { res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html')); });

// NOTE: s3 url needs to be in this format: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/1.jpg'
// Currently, Postgres has the url saved as '1.jpg'

// create / POST
app.post('/api/listing', (req, res) => {
  // TODO: create an entry based on database
  res.send('create an entry in the database');
})

// read / GET
app.get('/api/listing/:productId', (req, res) => {
  // TODO: update code based on database
  Product.find({productId: req.params.productId}, (err, products) => {
    if (err) {
      return console.error(err);
    }
    res.send(products);
  });
});

// update / PUT
app.put('/api/listing/:productId', (req, res) => {
  // TODO: create an entry based on database
  res.send(`update entry with id ${req.params.productId}`);
});

// delete / DELETE
app.delete('/api/listing/:productId', (req, res) => {
  // TODO: create an entry based on database
  res.send(`delete entry with id ${req.params.productId}`);
});


// Original API routes
// app.get('/api/carousel', (req, res) => {
//   Product.find({}, (err, products) => {
//     if (err) {
//       return console.error(err);
//     }
//     console.log(products);
//     res.send(products);
//   })
// })

// app.get('/api/carousel/:productId', (req, res) => {
//   Product.find({productId: req.params.productId}, (err, product) => {
//     if (err) {
//       return console.error(err);
//     }
//     console.log(product);
//     res.send(product);
//   })
// });

// app.get('/api/carousel/products/:name', (req, res) => {
//   Product.find({name: req.params.name}, (err, product) => {
//     if (err) {
//       return console.error(err);
//     }
//     console.log(product);
//     res.send(product);
//   })
// })

const port = 3003;
app.listen(port, () => {
  console.log(`server listening to port ${port}`);
})


module.exports = app;