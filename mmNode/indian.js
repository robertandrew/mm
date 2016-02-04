var io = require('indian-ocean');
var d3 = require('d3');
var transform = require('./transform');

var video = io.readDataSync('video2.tsv');

io.writeDataSync('video3.csv',video);

console.log(video);
