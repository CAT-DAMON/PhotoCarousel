const faker = require('faker');
// const postgres = require('./postgres.js');
const fs = require('fs');

// url to images hosted on s3
let s3urls = {
  1: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/1.jpg',
  2: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/2.jpg',
  3: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/3.png',
  4: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/4.jpg',
  5: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/5.jpg',
  6: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/6.jpg',
  7: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/7.jpg',
  8: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/8.jpg',
  9: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/9.jpg',
  10: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/10.jpg',
  11: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/11.jpg',
  12: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/12.jpg',
  13: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/13.jpg',
  14: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/14.jpg',
  15: 'https://hrr-sdc-catdamon-photo-carousel.s3.us-east-2.amazonaws.com/15.jpg'
}

let fakeImageSets = {};
// Generate fake image sets out of
for (var i = 1; i <= 15; i += 1) {
  // generate image and lock based on i
  let fakeImageSet = [];
  for (var j = 0; j < 5; j++) {
    fakeImageSet.push(s3urls[i + j]);
  }
  fakeImageSets[i] = fakeImageSet;
}

let fakeData = [];

// TODO: need to either export data here to a different script or seed here
// directly based on which db I am using

const insertFakeData = async function() {
  // TODO: fill this out based on db
  // console.log(fakeData);
  // debugger;
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

// TODO: will want to load to database in this function
const test = (fakeData) => {
  // non csv version
  // var test = JSON.stringify(fakeData);
  // await postgres.query(`INSERT INTO photo_carousel (productId, name, photos) VALUES ${}`)

  // console.log(fakeData.length);
  // console.log(fakeData[0]);
  // console.log(fakeData[0].productId);
}

const generateFakeData = (index) => {
  let data = [];
  let size = 10;
  for (var i = 1; i <= size; i += 1) {
    const index = i % 15;
    data.push({
      productId: i + index * size,
      name: faker.commerce.productName(),
      photos: fakeImageSets[index]
    })
    //console.log('i: ' + i);
  }
  return data;
}

// write stream csv version
// const generateCSVData = async (index, stream) => {
//   const size = 1000;
//   for (var i = 1; i <= size; i++) {
//     const productId = i + index * (size);
//     const name = faker.commerce.productName();
//     const photos = JSON.stringify(fakeImageSets[index + 1]);
//     const fakeData = `${productId},${name},${photos}\n`;
//     await stream.write(fakeData);
//   }
// }

const generateCSVData = async (index, stream) => {
  const size = 1e8;
  for (let i = 1; i <= size; i++) {
    const productId = i + index * (size);
    const name = faker.commerce.productName();
    const photos = JSON.stringify(fakeImageSets[index + 1]);
    const fakeData = `${productId},${name},${photos}\n`;
    if (!stream.write(fakeData)) {
      await new Promise(resolve => stream.once('drain', resolve)).catch((err) => console.log(err));
    }
  }
}

try {
  insertFakeData();
} catch(err) {
  console.log(err.stack);
}
