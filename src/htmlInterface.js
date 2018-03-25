/* globals handleInput, utilities, setupCities */
/* exported htmlInterface, panOnloadFunc */
var htmlInterface = function() {
    function debug(evnt) {
        var cmd = evnt.code.toString();
        var info = JSON.parse(sessionStorage.getItem('game_data'));
        if (cmd == "Period") {
            info.players.moves_left += 1000;
            handleInput.update_page(info);
            return;
        }
        if (cmd.startsWith("Digit")) {
            var numb = parseInt(cmd.substring(5));
            if (numb >= 4) {
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
            var letter = cmd.substring(3);
            var dptr = "ABCD".indexOf(letter);
            if (dptr < 0) {
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

