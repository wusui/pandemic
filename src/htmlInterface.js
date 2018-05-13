/* globals handleInput, utilities, setupCities, germHandler*/
/* exported htmlInterface, panOnloadFunc */
var htmlInterface = function() {
    var DID_LOTS_OF_MOVES = 500;
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
            if (info.players.moves_left > DID_LOTS_OF_MOVES) {
                info.players.moves_left = 1;
            }
            else {
                info.players.moves_left += LOTS_OF_MOVES;
            }
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
                if (letter == "Q") {
                    info.card_decks.inf_disc.shift();
                }
                if (letter == "W") {
                    var ltemp = info.card_decks.infections.shift();
                    info.card_decks.inf_disc.push(ltemp);
                }
                if (letter == "O") {
                    info.diseases.BLACK.cured = 1;
                    info.diseases.YELLOW.cured = 1;
                    info.diseases.RED.cured = 1;
                }
                var sptr = "HIJKL".indexOf(letter);
                if (sptr >= 0) {
                    info.players.plist[p].cards.push(sptr + utilities.FIRST_SPECIAL_CARD);
                }
                sptr = "PNM".indexOf(letter);
                if (sptr >= 0) {
                    var tmpdck = info.card_decks.player_cards;
                    info.card_decks.player_cards = [];
                    for (var ii=0; ii<sptr; ii++) {
                        info.card_decks.player_cards.push(tmpdck[ii]);
                    }
                }
                handleInput.update_page(info);
                return;
            }
            var dindx = utilities.get_color_name(dptr);
            var dizloc = info.players.plist[p].xlocation.toString();
            germHandler.infect(info, dindx, dizloc, 1);
            handleInput.update_page(info);
        }
    }

    return {
        debug:debug
    };
}();

function panOnloadFunc() {
    sessionStorage.setItem(handleInput.TIMELOCK, 'off');
    setupCities.initialize(setupCities.callback);
}

