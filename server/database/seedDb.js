const faker = require('faker');

let fakeImageSets = {};
// Generate fake image sets out of
for (var i = 0; i < 30; i += 1) {
  // generate image and lock based on i
  let fakeImageSet = []
  for (var j = 0; j < 5; j++) {
    fakeImageSet.push(faker.image.imageUrl())
  }
  fakeImageSets[i] = fakeImageSet;
}

let fakeData = [];

// TODO: need to adjust how I want to deal with the fake images
for (var i = 1; i <= 10000000; i += 1) {
  const index = i % 30;
  fakeData.push({
    productId: i,
    name: faker.commerce.productName(),
    photos: fakeImageSets[index];
  })
}

// TODO: need to either export data here to a different script or seed here
// directly based on which db I am using

const insertFakeData = function () {
  // TODO: fill this out based on db
};

insertFakeData();