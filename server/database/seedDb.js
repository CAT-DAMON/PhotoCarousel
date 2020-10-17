const faker = require('faker');
const postgres = require('./postgres.js');
const fs = require('fs');

// url to images hosted on s3
// let s3urls = {
//   1: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/1.jpg',
//   2: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/2.jpg',
//   3: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/3.png',
//   4: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/4.jpg',
//   5: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/5.jpg',
//   6: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/6.jpg',
//   7: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/7.jpg',
//   8: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/8.jpg',
//   9: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/9.jpg',
//   10: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/10.jpg',
//   11: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/11.jpg',
//   12: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/12.jpg',
//   13: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/13.jpg',
//   14: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/14.jpg',
//   15: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/15.jpg'
// }

let s3urls = {
  1: '1.jpg',
  2: '2.jpg',
  3: '3.png',
  4: '4.jpg',
  5: '5.jpg',
  6: '6.jpg',
  7: '7.jpg',
  8: '8.jpg',
  9: '9.jpg',
  10: '10.jpg',
  11: '11.jpg',
  12: '12.jpg',
  13: '13.jpg',
  14: '14.jpg',
  15: '15.jpg'
}

let fakeImageSets = {};
// Generate fake image sets out of
for (var i = 1; i <= 15; i += 1) {
  // generate image and lock based on i
  let fakeImageSet = [];
  var imageNum = Math.floor(Math.random() * 5) + 3;
  for (var j = 0; j < imageNum; j++) {
    const urlSetIndex = Math.ceil(Math.random() * 15);
    fakeImageSet.push(s3urls[urlSetIndex]);
  }
  fakeImageSets[i] = fakeImageSet;
}

let fakeData = [];

// TODO: need to either export data here to a different script or seed here
// directly based on which db I am using

const createFakeDataCSV = async function() {
  // TODO: fill this out based on db
  const writeStream = fs.createWriteStream('photoCarousel.csv');
  writeStream.write('productId,name,photos\n');
  // for (var i = 0; i < 10; i += 1) {
  //   // Direct insert into db
  //   // const fakeDataToAdd = await generateFakeData(i);
  //   // await test(fakeDataToAdd);
  // }

  // writeStream version
  await generateCSVData(i, writeStream);
  writeStream.close();
};

// const generateFakeData = (index) => {
//   let data = [];
//   let size = 10;
//   for (var i = 1; i <= size; i += 1) {
//     const index = i % 15;
//     data.push({
//       productId: i + index * size,
//       name: faker.commerce.productName(),
//       photos: fakeImageSets[index]
//     })
//     //console.log('i: ' + i);
//   }
//   return data;
// }

const generateCSVData = async (index, stream) => {
  const size = 1e8;
  // const size = 100;
  for (let i = 1; i <= size; i++) {
    const imageSetIndex = Math.ceil(Math.random() * 15);
    const productId = i;
    const name = faker.commerce.productName();
    const photos = fakeImageSets[imageSetIndex];
    // const photos = [faker.image.imageUrl(), faker.image.imageUrl(), faker.image.imageUrl(), faker.image.imageUrl(), faker.image.imageUrl()];
    const fakeData = `${productId},${name},"{${photos}}"\n`;
    if (!stream.write(fakeData)) {
      await new Promise(resolve => stream.once('drain', resolve)).catch((err) => console.log(err));
    }
  }
}

// TODO: will want to load to database in this function
const loadDataIntoDb = async () => {
  console.log('drop table')
  await postgres.query('DROP TABLE IF EXISTS photo_carousel;')
  console.log('create table')
  await postgres.query(`
  CREATE TABLE photo_carousel (
    id serial PRIMARY KEY,
    productId int NOT NULL,
    name varchar,
    photos varchar[]
  );
  `)
  console.log('load data')
  await postgres.query(`
  COPY photo_carousel(productId, name, photos)
  FROM '/mnt/c/Users/10thl/hongmm/PhotoCarousel/photoCarousel.csv'
  WITH DELIMITER ','
  CSV HEADER;
  `)
  await postgres.end()
}

const seedData = async () => {
  try {
    console.log('Starting operations...');
    await createFakeDataCSV();
    await loadDataIntoDb();
  } catch(err) {
    console.log(err.stack);
  } finally {
    console.log('Operations finished');
  }
}

seedData();