var utils = {}

let templates   = 1;
let champions   = 144;
let items       = 155;
let boots       = 9;
let trinkets    = 3;
let spells      = 11;
let total       = templates + champions + items + boots + trinkets + spells;

utils.counters = {
    templates:  templates,
    champions:  champions,
    items:      items,
    boots:      boots,
    trinkets:   trinkets,
    spells:     spells,
    total:      total
}

utils.makeScoreboard = function makeScoreboard(screen_name) {

    var hash = utils.sha256(screen_name);
    let spells = utils.makeSpells(hash);

    var scoreboard = {
        name:       screen_name,
        result:     utils.makeResult(hash),
        champion:   (parseInt('0x' + hash.substring(2, 6)) % utils.counters.champions),
        lvl:        (parseInt('0x' + hash.substring(7, 9)) % 18) + 1,
        spell1:     spells.spell1,
        spell2:     spells.spell2,
        boots:      (parseInt('0x' + hash.substring(16, 18)) % utils.counters.boots),
        item2:      (parseInt('0x' + hash.substring(19, 23)) % utils.counters.items),
        item3:      (parseInt('0x' + hash.substring(24, 28)) % utils.counters.items),
        item4:      (parseInt('0x' + hash.substring(29, 33)) % utils.counters.items),
        item5:      (parseInt('0x' + hash.substring(34, 38)) % utils.counters.items),
        item6:      (parseInt('0x' + hash.substring(39, 43)) % utils.counters.items),
        trinket:    (parseInt('0x' + hash.substring(44, 46)) % utils.counters.trinkets),
        kda:        utils.makeKDA(hash),
        cs:         utils.makeCS(hash),
        gold:       utils.makeGold(hash),
        gametime:   utils.makeGameTime(hash),
        date:       utils.makeDate()
    };

    return scoreboard;
}

utils.makeResult = function makeResult(hash) {
    let result = (parseInt('0x' + hash.substring(0, 1)) % 2);

    if(result == 0) {
        return 'red';
    } else {
        return 'blue';
    }
}

utils.makeSpells = function makeSpells(hash) {
    let spell1 = (parseInt('0x' + hash.substring(10, 12)) % utils.counters.spells);

    let spell2 = (parseInt('0x' + hash.substring(13, 15)) % utils.counters.spells);

    while(spell1 == spell2) {
        hash = utils.sha256(hash);
        spell2 = (parseInt('0x' + hash.substring(13, 15)) % utils.counters.spells);
    }

    return { spell1: spell1, spell2: spell2 };
}

utils.makeKDA = function makeKDA(hash) {
    let kills   = (parseInt('0x' + hash.substring(46, 47)));
    let deaths  = (parseInt('0x' + hash.substring(48, 49)));
    let assists = (parseInt('0x' + hash.substring(50, 52)) % 32);

    return (kills + ' / ' + deaths + ' / ' + assists);
}

utils.makeCS = function makeCS(hash) {
    let cs = (parseInt('0x' + hash.substring(53, 56)) % 513);

    if(cs < 10) {
        return ('      ' + cs);
    }
    if(cs < 100) {
        return ('   ' + cs);
    } else {
        return (cs);
    }
}

utils.makeGold = function makeGold(hash) {
    let gold = (parseInt('0x' + hash.substring(57, 64)) % 25001);
    let goldF = utils.numberFormat((parseInt('0x' + hash.substring(57, 64)) % 25001));

    if(gold < 10) {
        return ('             ' + goldF);
    }
    if(gold < 100) {
        return ('          ' + goldF);
    }
    if(gold < 1000) {
        return ('       ' + goldF);
    }
    if(gold < 10000) {
        return ('   ' + goldF);
    } else {
        return (goldF);
    }
}

utils.makeGameTime = function makeGameTime(hash) {
    let minutes = (parseInt('0x' + hash.substring(0, 31)) % 60);
    let seconds = (parseInt('0x' + hash.substring(32, 64)) % 60);

    if(seconds < 10) {
        seconds = '0' + seconds;
    }
    
    return (minutes + ':' + seconds);
}

utils.makeDate = function makeDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!

    let yyyy = today.getFullYear();
    
    if(dd < 10) {
        dd = '0' + dd;
    }
    if(mm < 10) {
    mm = '0' + mm;
    }
    return (dd + '/' + mm + '/' + yyyy);
}

utils.numberFormat = function numberFormat(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

utils.makeTweet = function makeTweet(tweet, imagem) {

    var composedTweet = {
        status: '@' + tweet.user.screen_name,
        in_reply_to_status_id: tweet.id_str,
        media_ids: imagem.media_id_string
    };

    return composedTweet;

}

utils.sha256 = function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };

    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;

    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }

    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return; // ASCII check: only accept characters in range 0-255
        words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)

    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if
            var w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                    )|0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj

            hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1)|0;
        }

        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }


    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }

    return result;
}

module.exports = utils;
