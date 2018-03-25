/* globals handleInput, clickCard */
/* exported clickCity */
var clickCity = function() {

    function moveIt(mover, action, info) {
       info.players.plist[mover].xlocation = action;
       info.misc.dispatched_player = -1;
       info.players.moves_left = info.players.moves_left - 1;
       handleInput.update_page(info);
    }

    function clickCity(action, info, citymap) {
        var mover = info.players.plyr_move;
        var disptch = false;
        if (info.players.plist[mover].name == 'D') {
            disptch = true;
        }
        if (info.misc.dispatched_player >= 0) {
            mover = info.misc.dispatched_player;
            disptch = true;
        }
        var oloc = info.players.plist[mover].xlocation;
        var iamat = citymap.bynumb[oloc];
        var mloc = citymap.byname[action].number;
        if (mloc == oloc) {
            return;
        }
        var near = citymap.byname[iamat].neighbors;
        for (var i=0; i < near.length; i++) {
            if (action == near[i]) {
                moveIt(mover, mloc, info);
                return;
            }
        }
        if (info.misc.research_stations.includes(oloc) && info.misc.research_stations.includes(mloc)) {
            moveIt(mover, mloc, info);
            return;
        }
        if (disptch) {
            for (var dpc = 0; dpc < info.players.plist.length; dpc++) {
                if (info.players.plist[dpc].xlocation == mloc) {
                    moveIt(mover, mloc, info);
                    return;
                }
            }
        }
        if (oloc == info.misc.card_played || mloc ==  info.misc.card_played) {
            moveIt(mover, mloc, info);
            clickCard.discard(info);
            return;
        }
        if (info.players.plist[mover].name == 'O') {
            if (info.misc.op_exp_used_power === 0 && info.misc.card_played >= 0) {
                info.misc.op_exp_used_power = 1;
                moveIt(mover, mloc, info);
                clickCard.discard(info);
            }
        }
    }

    return {
        clickCity:clickCity
    };
}();
