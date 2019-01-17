//usage: node sub.js
var zmq = require('zmq');
var sock = zmq.socket('sub');//sub to xpub
var req = zmq.socket('req');//req to tep


sock.connect('tcp://127.0.0.1:5555');//sub to xpub
sock.subscribe('INFO');

var continueRunning = true;
process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    if(continueRunning){
        continueRunning = false;
        sock.close();
        req.close();
    }else{
        process.exit();
    }
});

sock.on('message', function(data) {
    console.log(data.toString());
    var splited = data.toString().split("-");
    var port = splited[0].split(" ")[1];
    var keys = splited[1].split(",");
    console.log("Server with port " + port + " has the data " + keys);
    //request(port,keys);
    reqSock = req.connect("tcp://127.0.0.1:" + port.toString());
    reqSock.send(keys[Math.floor(Math.random()*keys.length)]);
});

req.on('message', function(msg) {
    console.log(msg.toString());
});


function request(port, keys){
    var reqSock = req.connect("tcp://127.0.0.1:" + port.toString());
    reqSock.send(keys[Math.floor(Math.random()*keys.length)]);
    //setTimeout(() => {reqSock.close();},1000);
}