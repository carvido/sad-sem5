//usage: node proxy.js

var zmq = require('zmq');

var pub = 'tcp://127.0.0.1:5555';//pub for sub.js
var sub = 'tcp://127.0.0.1:5556';//sub for pub.js

var hwm = 1000;
var verbose = 0;

//xsub
var subSock = zmq.socket('xsub');
subSock.identity = 'subscriber' + process.pid;
subSock.bindSync(sub);

//xpub
var pubSock = zmq.socket('xpub');
pubSock.identity = 'publisher' + process.pid;
pubSock.setsockopt(zmq.ZMQ_SNDHWM, hwm);


pubSock.setsockopt(zmq.ZMQ_XPUB_VERBOSE, verbose);
pubSock.bindSync(pub);

subSock.on('message', function(data) {
 pubSock.send(data);
});


pubSock.on('message', function(data, bla) {
  var type = data[0]===0 ? 'unsubscribe' : 'subscribe';
  var channel = data.slice(1).toString();
  console.log(type + ':' + channel);
  subSock.send(data);
});