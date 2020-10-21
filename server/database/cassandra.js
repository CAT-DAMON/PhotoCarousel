const cassandra = require('cassandra-driver');
const dotenv = require('dotenv');

dotenv.config();

const PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider;
const client = new cassandra.Client({
  contactPoints: [process.env.CCONTACTPOINTS],
  localDataCenter: process.env.CLOCALDC,
  authProvider: new PlainTextAuthProvider(process.env.CUSER, process.env.CPASSWORD),
});

module.exports = client;
