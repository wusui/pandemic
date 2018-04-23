/* globals handleInput, utilities, setupCities */
/* exported htmlInterface, panOnloadFunc */
var htmlInterface = function() {
    var LOTS_OF_MOVES = 1000;
    var NUMBER_PART = 5;
    var LETTER_PART = 3;
    var TURN_ME_OFF = false;
    function debug(evnt) {
        var cmd = evnt.code.toString();
        var info = JSON.parse(sessionStorage.getItem('game_data'));
        if (TURN_ME_OFF) {
            return;
        }
        if (cmd == "Period") {
            info.players.moves_left += LOTS_OF_MOVES;
            handleInput.update_page(info);
            return;
        }
        if (cmd.startsWith("Digit")) {
            var numb = parseInt(cmd.substring(NUMBER_PART));
            if (numb >= info.players.plist.length) {
                return;
            }
            info.players.plyr_move = numb;
            handleInput.update_page(info);
            return;
        }
        var p = info.players.plyr_move;
        if (cmd == "KeyX") {
            var cardv = info.players.plist[p].xlocation;
            info.players.plist[p].cards.push(cardv);
            handleInput.update_page(info);
            return;
        }
        if (cmd.startsWith("Key")) {
            var letter = cmd.substring(LETTER_PART);
            var dptr = "ABCD".indexOf(letter);
            if (dptr < 0) {
                if (letter == "Z") {
                    alert(JSON.stringify(info));
                }
                var sptr = "HIJKL".indexOf(letter);
                if (sptr < 0) {
                    return;
                }
                info.players.plist[p].cards.push(sptr + utilities.FIRST_SPECIAL_CARD);
                handleInput.update_page(info);
                return;
            }
            var dindx = utilities.get_color_name(dptr);
            var dizloc = info.players.plist[p].xlocation.toString();
            if (Object.keys(info.diseases[dindx].infections).includes(dizloc)) {
                info.diseases[dindx].infections[dizloc]++;
            }
            else {
                info.diseases[dindx].infections[dizloc] = 1;
            }
            info.diseases[dindx].count -= 1;
            handleInput.update_page(info);
        }
    }

    return {
        debug:debug
    };
}();

function panOnloadFunc() {
    setupCities.initialize(setupCities.callback);
}

