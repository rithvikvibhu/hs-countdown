# Handshake Countdown

A simple website to track historic events related to the [Handshake](https://handshake.org) blockchain.

This consists of:
- A Node.js Express server with Socket.io that connects to an hsd node for blockchain events
- A React webpage that connects to the server and listens for updates

## To run

```sh
# Install dependencies (node.js v14)
npm install

# Build client
npm run build

# Start server
HSD_NETWORK=mainnet HSD_API_KEY=apikey node server/index.js
```

## Development

```sh
# Start app in development mode with hot-reloading
npm start
```
