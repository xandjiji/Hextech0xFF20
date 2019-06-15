var Jimp        = require('jimp');
var fs          = require('fs');

var keys        = require('./keys.env');
var utils       = require('./utils');
var logging     = require('./logging');

var jimps = [];
loadAssets();

function makeImage(name) {

    var scoreboard = utils.makeScoreboard(name);

    Promise.all(jimps).then(function(data) {
        return Promise.all(jimps);
    })
    .then(function(data) {

        /*
            template:   0
            champions:  1-144
            items:      145-302
            boots:      303-311
            trinkets:   312-314
            spells:     315-325
            template:   326
        */

        // drawing champion
        data[0].composite(data[1+scoreboard.champion], 21, 18);

        // drawing boots
        data[0].composite(data[303+scoreboard.boots],   320 + (42 * 0), 24);
        
        // drawing items
        data[0].composite(data[145+scoreboard.item2],   320 + (42 * 1), 24);
        data[0].composite(data[145+scoreboard.item3],   320 + (42 * 2), 24);
        data[0].composite(data[145+scoreboard.item4],   320 + (42 * 3), 24);
        data[0].composite(data[145+scoreboard.item5],   320 + (42 * 4), 24);
        data[0].composite(data[145+scoreboard.item6],   320 + (42 * 5), 24);

        // drawing trinket
        data[0].composite(data[312+scoreboard.trinket], 320 + (42 * 6), 24);

        // drawing spells
        data[0].composite(data[315+scoreboard.spell1], 124, 71);
        data[0].composite(data[315+scoreboard.spell2], 149, 71);

        // drawing template again
        data[0].composite(data[326], 0, 0);



        Jimp.loadFont('assets/fonts/beaufort_' + scoreboard.result + '.fnt').then(font => {
            if(scoreboard.result == 'red'){
                data[0].print(font, 123, 17, 'DEFEAT');
            } else {
                data[0].print(font, 123, 17, 'VICTORY');
            }

            Jimp.loadFont('assets/fonts/spiegel15.fnt').then(font => {
                data[0].print(font, 654, 21, `Summoner's Rift`);
                data[0].print(font, 654, 21 + 31, `${scoreboard.gametime}   -   ${scoreboard.date}`);
                data[0].print(font, 124, 17 + 25, scoreboard.name);

                Jimp.loadFont('assets/fonts/beaufort_normal.fnt').then(font => {
                    data[0].print(font, 319, 74, scoreboard.kda);
                    data[0].print(font, 456, 74, scoreboard.cs);
                    data[0].print(font, 541, 74, scoreboard.gold);

                    Jimp.loadFont('assets/fonts/beaufort_lvl.fnt').then(font => {
                        if(scoreboard.lvl < 10) {
                            data[0].print(font, 85, 70, scoreboard.lvl);
                        } else {
                            data[0].print(font, 81, 70, scoreboard.lvl);
                        }

                        data[0].write('saved/' + scoreboard.name + '.png', next);
                    })
                });
            });
        });
    });
}


function next() {
    return console.log('pronto');    
}

makeImage('xandxandxand');

// loading assets
function loadAssets() {

    logging.loadingAssetsMsg();

    // loading template
    jimps.push(Jimp.read('assets/template.png'));

    // loading champions
    for(let i = 1; i < 145; i++) {
        jimps.push(Jimp.read('assets/champions/' + i + '.png'));
    }

    // loading items
    for(var i = 1; i < 159; i++) {
        jimps.push(Jimp.read('assets/items/' + i + '.png'));
    }

    // loading boots
    for(var i = 1; i < 10; i++) {
        jimps.push(Jimp.read('assets/items/boots/' + i + '.png'));
    }

    // loading trinkets
    for(var i = 1; i < 4; i++) {
        jimps.push(Jimp.read('assets/items/trinkets/' + i + '.png'));
    }

    // loading spells
    for(var i = 1; i < 12; i++) {
        jimps.push(Jimp.read('assets/spells/' + i + '.png'));
    }

    // saving the template
    jimps.push(Jimp.read('assets/template.png'));
}
