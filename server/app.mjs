import { createServer } from 'https';
import { readFileSync } from 'fs';
import { WebSocketServer } from 'ws';
import config from './config.mjs';


let options = {};
if(config.isSSL){
    options = {
        cert: readFileSync('/path/to/cert.pem'),
        key: readFileSync('/path/to/key.pem')
    };
}

const server = createServer(options);

const wss = new WebSocketServer({server});

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something');
});

server.listen(9999);