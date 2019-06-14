var Jimp        = require('jimp');
var fs          = require('fs');

var keys        = require('./keys.env');
var utils       = require('./utils');
var logging     = require('./logging');

let asd = Math.random();
asd = utils.sha256(asd);

let teste = utils.makeScoreboard(asd);

var jimps = [];
loadAssets();






















// loading assets
function loadAssets() {

    logging.loadingAssetsMsg();

    // loading template
    jimps.push(Jimp.read('assets/template.png'));

    // loading champions
    for(let i = 1; i < 253; i++) {
        jimps.push(Jimp.read('assets/champions/pokemon' + (i-1) + '.png'));
    }

    // carregando insigneas (kanto)
    for(var i = 253; i < 261; i++) {
        jimps.push(Jimp.read('assets/badges/kanto/kanto' + (i-253) + '.png'));
    }

    // carregando insigneas (johto)
    for(var i = 261; i < 269; i++) {
        jimps.push(Jimp.read('assets/badges/johto/johto' + (i-253) + '.png'));
    }

    // carregando treinadores
    for(var i = 269; i < 376; i++) {
        jimps.push(Jimp.read('assets/trainers/trainer' + (i-269) + '.png'));
    }

    // salvando template
    jimps.push(Jimp.read('assets/card.png'));
}
