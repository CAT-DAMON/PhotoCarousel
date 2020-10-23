// const db = require('./database/index.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const Product = require('./database/Carousel.js');
const postgres = require('./database/postgres.js');
const newRelic = require('newrelic');
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
  const data = req.body;
  postgres.query(`INSERT INTO photo_carousel(productid, name, photos) VALUES(${req.body.productId}, ${req.body.name}, ${req.body.photos});`)
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    console.error(err.stack);
  })
  // res.send('create an entry in the database');
})

// read / GET
app.get('/api/listing/:productId', (req, res) => {
  // TODO: update code based on database
  postgres.query(`SELECT * FROM photo_carousel WHERE productid = ${req.params.productId};`)
  .then((result) => {
    let resultData = result.rows[0];
    for (let i = 0; i < resultData.photos.length; i++) {
      resultData.photos[i] = 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/' + resultData.photos[i];
    }

    console.log(resultData);
    res.send([resultData]);
  })
  .catch((err) => {
    console.error(err.stack);
  })
});

// update / PUT
app.put('/api/listing/:productId', (req, res) => {
  // TODO: create an entry based on database
  postgres.query(`UPDATE photo_carousel SET name = ${req.body.name}, photos = ${req.body.photos} WHERE productid = ${req.params.productId};`)
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    console.error(err.stack);
  })
  // res.send(`update entry with id ${req.params.productId}`);
});

// delete / DELETE
app.delete('/api/listing/:productId', (req, res) => {
  // TODO: create an entry based on database
  postgres.query(`DELETE FROM photo_carousel WHERE productid = ${req.params.productId};`)
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    console.error(err.stack);
  })
  // res.send(`delete entry with id ${req.params.productId}`);
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