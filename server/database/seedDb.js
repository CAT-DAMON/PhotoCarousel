const faker = require('faker');
const postgres = require('./postgres.js');
const cassandra = require('./cassandra.js');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const s3urls = {
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
for (var i = 1; i <= 15; i += 1) {
  let fakeImageSet = [];
  var imageNum = Math.floor(Math.random() * 5) + 3;
  for (var j = 0; j < imageNum; j++) {
    const urlSetIndex = Math.ceil(Math.random() * 15);
    fakeImageSet.push(s3urls[urlSetIndex]);
  }
  fakeImageSets[i] = fakeImageSet;
}

const createFakeDataCSV = async function() {
  const writeStream = fs.createWriteStream('photoCarousel.csv');
  writeStream.write('productId,name,photos\n');
  await generateCSVData(i, writeStream);
  writeStream.close();
};

const generateCSVData = async (index, stream) => {
  const size = 1e7;
  for (let i = 1; i <= size; i++) {
    const imageSetIndex = Math.ceil(Math.random() * 15);
    const productId = i;
    const name = faker.commerce.productName();
    const photos = fakeImageSets[imageSetIndex];
    const fakeData = `${productId},${name},"{${photos}}"\n`;
    if (!stream.write(fakeData)) {
      await new Promise(resolve => stream.once('drain', resolve)).catch((err) => console.log(err));
    }
  }
}

if (process.env.DB === 'postgres') {
  // Postgres version
  const loadDataIntoDb = async () => {
    postgres.connect();
    console.log(`Connected to postgres on port ${process.env.PGPORT} with host ${process.env.PGHOST} for ${process.env.PGDATABASE}`)

    console.log('drop table');
    await postgres.query('DROP TABLE IF EXISTS photo_carousel;');
    console.log('create table');
    await postgres.query(`
    CREATE TABLE photo_carousel (
      id serial PRIMARY KEY,
      productId int NOT NULL,
      name varchar,
      photos varchar[]
    );
    `);
    console.log('load data');
    await postgres.query(`
    COPY photo_carousel(productId, name, photos)
    FROM '/mnt/c/Users/10thl/hongmm/PhotoCarousel/photoCarousel.csv'
    WITH DELIMITER ','
    CSV HEADER;
    `);
    await postgres.end();
  }
} else if (process.env.DB === 'cassandra') {
  // Cassandra version
  const loadDataIntoDb = async () => {
    await cassandra.connect();
    console.log(`Connected to ${cassandra.hosts.length} nodes in the cluster: ${cassandra.hosts.keys().join(', ')}`);

    const query = `CREATE KEYSPACE IF NOT EXISTS sdc WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}`;
    await cassandra.execute(query);

    console.log('create table');
    await cassandra.execute(`
      CREATE TABLE IF NOT EXISTS sdc.photo_carousel (
        productId int,
        name varchar,
        photos list<varchar>,
        PRIMARY KEY (productId)
      );
    `);

    console.log('clear data');
    await cassandra.execute('TRUNCATE sdc.photo_carousel');

    console.log('load data from csv using cqlsh COPY command');
    const copyQuery = `
      COPY sdc.photo_carousel(productId, name, photos)
      FROM '/mnt/c/Users/10thl/hongmm/PhotoCarousel/photoCarousel.csv'
      WITH HEADER = TRUE AND DELIMITER = ',';
    `;
    console.log('copyQuery: ' + copyQuery);
  }
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
