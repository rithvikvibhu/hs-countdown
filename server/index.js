const path = require('path');
const express = require('express');
const { NodeClient } = require('hs-client');
const { Network, ChainEntry } = require('hsd');

const events = require('./events.js');
let latestData = {};

// HSD
const network = Network.get(process.env.HSD_NETWORK || 'mainnet');
const nodeOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: process.env.HSD_API_KEY,
};
const nodeClient = new NodeClient(nodeOptions);

(async () => {
  // Connection and both channel subscriptions handled by opening client
  await nodeClient.open();
  console.log('Connected.');
  const tip = await nodeClient.getTip();
  latestData.currentHeight = ChainEntry.fromRaw(tip).height;
})();

// Listen for new blocks
nodeClient.bind('chain connect', (raw) => {
  const chainEntry = ChainEntry.fromRaw(raw);
  console.log('Node -- Chain Connect Event:\n', chainEntry);
  latestData.currentHeight = chainEntry.height;
  io.emit('newData', latestData);
});

// Express
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
  },
});

app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(express.static('public'));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

io.on('connection', (socket) => {
  console.log(
    `New connection. Currently connected to ${io.sockets.sockets.size} clients.`
  );
  socket.emit('newData', latestData);
  socket.emit('events', events);
});
server.listen(3001);
