import http from 'http-server';
import fs from 'fs';

const server = http.createServer((req, res) => {
    res.sendFile('./index.html');
});

server.listen(3001, () => {
    console.log('Server listening on port 3001');
});

export default server;