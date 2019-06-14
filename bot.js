
var fs          = require('fs');

var keys        = require('./keys.env');
var utils       = require('./utils');
var logging     = require('./logging');

let asd = Math.random();
asd = utils.sha256(asd);

let teste = utils.makeScoreboard(asd);

console.log(teste);


