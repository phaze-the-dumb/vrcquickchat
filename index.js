const { Client } = require('node-osc');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

let client = new Client('127.0.0.1', 9000);
let ip = 'Cannot Find Address';

http.createServer((req, res) => {
    if(req.url === '/' && req.method === 'GET'){
        fs.createReadStream('index.html').pipe(res);
    } else if(req.url === '/chatbox.json' && req.method === 'GET'){
        if(req.headers.text){
            client.send('/chatbox/input', [ req.headers.text, true ], () => res.end('{"this is": "formatted in json"}'));
        } else{
            client.send('/chatbox/input', [ '', true ], () => res.end('{"this is": "formatted in json"}'));
        }
    } else if(req.url === '/internalip' && req.method === 'GET'){
        res.end(ip);
    } else if(req.url === '/changeip' && req.method === 'GET'){
        client = new Client(req.headers.ip, 9000);
        res.end('ok');
    }
}).listen(7070, '0.0.0.0');

let ipconfig = spawn('ipconfig'); // does vrc even run on linux?

let text = ''
ipconfig.stdout.on('data', ( chunk ) =>
    text += chunk.toString());

ipconfig.stdout.on('end', () => {
    text = text.split('IPv4 Address. . . . . . . . . . . : ');
    text = text[1].split('\r\n');

    spawn('powershell', [ 'start', 'http://'+text[0]+':7070' ]);
    ip = text[0];
}) // pretty sure there is a better way of getting the internal ip of a user but i forgor