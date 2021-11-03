const http = require('http');
const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

const server = http.createServer(app);

server.listen(PORT, () => { console.log(`server running on port ${PORT}`); });

