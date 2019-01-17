//usage: node pub.js PORT DATAinJSON
var zmq = require('zmq');
var pub = zmq.socket('pub');
var rep = zmq.socket('rep');//reply to sub

var args = process.argv.slice(2);
var serverPort = args[0];
var data = JSON.parse(args[1]);
console.log("Server REPLY PORT: " + serverPort);
console.log("Server data: " + JSON.stringify(data));


pub.connect('tcp://127.0.0.1:5556');//connection pub->xsub

var repSock = rep.bind("tcp://127.0.0.1:" + serverPort, function(err){
    if(err){
        console.err("ERROR: Can't bind REPLY PORT " + serverPort);
    }else{
        console.log("Server REPLY PORT " + serverPort + " binded");
    }
});
repSock.on('message', function(msg) {
    console.log("Subscriber requesting data with key " + msg);
    repSock.send(data[msg]);
});

var keys = "";
for(var k in data) keys += k + ",";
if(keys.charAt(keys.length -1) === ","){
    keys = keys.substring(0,keys.length -1);
}

var continueRunning = true;
process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    if(continueRunning){
        continueRunning = false;
    }else{
        process.exit();
    }
});
pub.send('INFO ' + serverPort + '-' + keys);

function every2Seconds(i){
    if(continueRunning){
        setTimeout(() => {
            pub.send('INFO ' + serverPort + '-' + keys);
            console.log('Infinite Loop n:', i);
            every2Seconds(++i);
        }, 5000);
    }else{
        pub.close();
        rep.close();
    }
}
every2Seconds(0);