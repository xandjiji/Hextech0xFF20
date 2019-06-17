var Twitter     = require('twitter');
var Jimp        = require('jimp');
var fs          = require('fs');

var keys        = require('./keys.env');
var utils       = require('./utils');
var logging     = require('./logging');

var client = new Twitter(keys);

var jimps = [];
loadAssets();

// arrays and counters
let cooldownList = [];
var failedTweets = {
    queue: []
};
loadFailedTweets();

let successCount = 0;
let failCount = 0;
let retries = 0;
let cooldownMinutes = 240;

// reset the cooldown list every 10 minutes
setInterval(resetCooldown, cooldownMinutes * 1000 * 60);
function resetCooldown() {
    cooldownList = [];
    logging.resetMsg();
}

// tweets periodically a tweet that failed before
setInterval(reTweet, 1000 * 30);



// the bot is now ready
logging.readyMsg();

// triggers if  mentioned
client.stream('statuses/filter', {track: '@Hextech0xFF20'},  function(stream) {
    stream.on('data', function(tweet) {
        
        // if the user is not on cooldown
        if(cooldownList.includes(tweet.user.screen_name) == false) {

            var scoreboard = utils.makeScoreboard(tweet.user.screen_name);

            Promise.all(jimps).then(function(data) {
                return Promise.all(jimps);
            })
            .then(function(data) {
            
                /*
                    template:   0
                    champions:  1-144
                    items:      145-299
                    boots:      300-308
                    trinkets:   309-311
                    spells:     312-322
                    template:   323
                */

                let templateIndex = 0;
                let championsIndex  = (templateIndex    + utils.counters.templates);
                let itemsIndex      = (championsIndex   + utils.counters.champions);
                let bootsIndex      = (itemsIndex       + utils.counters.items);
                let trinketsIndex   = (bootsIndex       + utils.counters.boots);
                let spellsIndex     = (trinketsIndex    + utils.counters.trinkets);

                // drawing champion
                data[0].composite(data[championsIndex+scoreboard.champion], 21, 18);
            
                // drawing boots
                data[0].composite(data[bootsIndex+scoreboard.boots],   320 + (42 * 0), 24);
                
                // drawing items
                data[0].composite(data[itemsIndex+scoreboard.item2],   320 + (42 * 1), 24);
                data[0].composite(data[itemsIndex+scoreboard.item3],   320 + (42 * 2), 24);
                data[0].composite(data[itemsIndex+scoreboard.item4],   320 + (42 * 3), 24);
                data[0].composite(data[itemsIndex+scoreboard.item5],   320 + (42 * 4), 24);
                data[0].composite(data[itemsIndex+scoreboard.item6],   320 + (42 * 5), 24);
            
                // drawing trinket
                data[0].composite(data[trinketsIndex+scoreboard.trinket], 320 + (42 * 6), 24);
            
                // drawing spells
                data[0].composite(data[spellsIndex+scoreboard.spell1], 124, 71);
                data[0].composite(data[spellsIndex+scoreboard.spell2], 149, 71);
            
                // drawing template again
                data[0].composite(data[utils.counters.total], 0, 0);
            
            
                // writing
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
            
                                data[0].write('saved/' + scoreboard.name + '.png', function() {
                        
                                    // reseting data[0]
                                    data[0].composite(data[utils.counters.total], 0, 0);
            
                                    // uploading score image
                                    var imagem = fs.readFileSync('saved/' + scoreboard.name + '.png');
            
                                    client.post('media/upload', {media: imagem}, function(error, imagem, response) {
                                        if(!error) {
            
                                            // tweeting
                                            var status = utils.makeTweet(tweet, imagem);
            
                                            client.post('statuses/update', status, function(error, tweeted, response) {
                                                if(!error) {
                                                    successCount++;
                                                    logging.successMsg(tweet, successCount);
                                                    cooldownList.push(tweet.user.screen_name);
                                                }
                                                if(error) {
                                                    failCount++;
                                                    logging.failMsg(tweet, failCount, error);
                                                    //logging.errorMsg(error);
                                                    cooldownList.push(tweet.user.screen_name);
                                                    failedTweets.queue.push(status);
                                                }
                                            });
                                        }
                                        if(error) {
                                            failCount++;
                                            logging.failMsg(tweet, failCount, error);
                                            //logging.errorMsg(error);
                                        }
                                    });
                                });
                            })
                        });
                    });
                });
            });
        } else {
            // if the user is on cooldown
            logging.cooldownMsg(tweet);
        }
    });
    stream.on('error', function(error) {
        failCount++;
        logging.errorMsg(error);
    });
});

// loading assets
function loadAssets() {

    logging.loadingAssetsMsg();

    // loading template
    jimps.push(Jimp.read('assets/template.png'));

    // loading champions
    for(let i = 0; i < utils.counters.champions; i++) {
        jimps.push(Jimp.read('assets/champions/' + (i+1) + '.png'));
    }

    // loading items
    for(var i = 0; i < utils.counters.items; i++) {
        jimps.push(Jimp.read('assets/items/' + (i+1) + '.png'));
    }

    // loading boots
    for(var i = 0; i < utils.counters.boots; i++) {
        jimps.push(Jimp.read('assets/items/boots/' + (i+1) + '.png'));
    }

    // loading trinkets
    for(var i = 0; i < utils.counters.trinkets; i++) {
        jimps.push(Jimp.read('assets/items/trinkets/' + (i+1) + '.png'));
    }

    // loading spells
    for(var i = 0; i < utils.counters.spells; i++) {
        jimps.push(Jimp.read('assets/spells/' + (i+1) + '.png'));
    }

    // saving the template
    jimps.push(Jimp.read('assets/template.png'));
}

// rewteets a tweet that failed previously
function reTweet() {

	if(failedTweets.queue.length != 0) {
		client.post('statuses/update', failedTweets.queue[0], function(error, tweet, response) {
			if(!error) {
                successCount++; 

                // update and save failedTweets.json and cooldownList
                let screen_name = failedTweets.queue[0].status.substring(1, failedTweets.queue[0].status.indexOf(' '));
                cooldownList.push(screen_name);
                
                failedTweets.queue.shift();
                logging.oldSuccessMsg(failedTweets.queue.length, successCount);
                var failedTweetsStr = JSON.stringify(failedTweets);
                fs.writeFile('failedTweets.json', failedTweetsStr, (error) => { if(error){console.log(logging.timeStamp() + ' ' + error)} });
            }
            if(error) {
                if(error[0].code == 385){
                    failedTweets.queue.shift();
                }                
                retries++;
                
                logging.oldFailMsg(failedTweets.queue.length, retries, error);
                //logging.errorMsg(error);
                var failedTweetsStr = JSON.stringify(failedTweets);
                fs.writeFile('failedTweets.json', failedTweetsStr, (error) => { if(error){console.log(logging.timeStamp() + ' ' +  error)} });
			}
		});
	}
}

function loadFailedTweets() {

    fs.readFile('failedTweets.json', 'utf8', function (error, jsonString) {
        if(error) {
            fs.writeFile('failedTweets.json', '{"queue":[]}\n');
            return logging.initializedFileMsg();            
        }
        if(!error) {
            if(jsonString == ''){
                // initializing the failedTweets.json correctly
                fs.writeFile('failedTweets.json', '{"queue":[]}\n');
                logging.zeroTweetsLoadedMsg();
            } else {
                failedTweets = JSON.parse(jsonString);
                logging.tweetsLoadedMsg(failedTweets.queue.length);
            }
        }
    })
}
