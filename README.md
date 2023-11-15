# Handshake Countdown

#### **This project is archived. A better version of this countdown is now at https://github.com/htools-org/htools-calendar.**

---

A simple website to track historic events related to the [Handshake](https://handshake.org) blockchain.
It is currently hosted at http://countdown.rithvik/ (a better name is in reveal, will switch in a few days.)

This consists of:
- A Node.js Express server with Socket.io that connects to an hsd node for blockchain events
- A React webpage that connects to the server and listens for updates

## Add events
The list of events is in `server/events.js`. Please create a PR to add on to this file, or [open a new issue](https://github.com/rithvikvibhu/hs-countdown/issues/new).

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
