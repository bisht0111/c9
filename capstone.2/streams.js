const { ReplSet } = require('mongodb-topology-manager');
const mongoose = require('mongoose');

run().catch(error => console.error(error));

 function run(){
  console.log(new Date(), 'start');
  const bind_ip = 'localhost';
  // Starts a 3-node replica set on ports 31000, 31001, 31002, replica set
  // name is "rs0".
  const replSet = new ReplSet('mongod', [
    { options: { port: 31000, dbpath: `${__dirname}/data/db/31000`, bind_ip } },
    { options: { port: 31001, dbpath: `${__dirname}/data/db/31001`, bind_ip } },
    { options: { port: 31002, dbpath: `${__dirname}/data/db/31002`, bind_ip } }
  ], { replSet: 'rs0' });

  // Initialize the replica set
   replSet.purge();
   replSet.start();
  console.log(new Date(), 'Replica set started...');

  // Connect to the replica set
  const uri = 'mongodb://localhost:31000,localhost:31001,localhost:31002/' +
    'test?replicaSet=rs0';
   mongoose.connect(uri);

  // To work around "MongoError: cannot open $changeStream for non-existent
  // database: test" for this example
   mongoose.connection.createCollection('people');

  const Person = mongoose.model('Person', new mongoose.Schema({ name: String }));

  // Create a change stream. The 'change' event gets emitted when there's a
  // change in the database
  Person.watch().
    on('change', data => console.log(new Date(), data));

  // Insert a doc, will trigger the change stream handler above
  console.log(new Date(), 'Inserting doc');
   Person.create({ name: 'Axl Rose' });
  console.log(new Date(), 'Inserted doc');
}