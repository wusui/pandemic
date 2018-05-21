/* globals handleInput, clickCard, utilities, useSpecWindow */
/* exported clickCity */
var clickCity = function() {

    function moveIt(mover, action, info) {
        info.players.plist[mover].xlocation = action;
        info.misc.dispatched_player = -1;
        info.players.moves_left--;
        handleInput.update_page(info);
    }

    function clickCity(action, info, citymap) {
        if (info.misc.special_action == utilities.SA_AIRLIFT_LOCATION) {
            info.players.plist[info.misc.airlifted_player].xlocation = citymap.byname[action].number;
            info.misc.special_action = 0;
            info.misc.airlifted_player = -1;
            useSpecWindow.clean_up(info);
            if (info.misc.discarding_special) {
                useSpecWindow.discard_continue(info, info.misc.card_stash);
            }
            if (info.misc.special_between_turns) {
                germHandler.epid_continue(info);
            }
            return;
        }
        if (info.misc.special_action == utilities.SA_GOV_GRANT) {
            var newr = citymap.byname[action].number;
            var okayloc = true;
            for (var irsc=0; irsc<info.misc.research_stations.length; irsc++) {
                if (info.misc.research_stations[irsc] == newr) {
                    okayloc = false;
                    break;
                }
            }
            if (okayloc) {
                info.misc.research_stations.push(newr);
                if (info.misc.research_stations.length > utilities.R_STA_MAX) {
                    useSpecWindow.tooManyStations(info, citymap);
                    info.misc.special_action = 0;
                    if (info.misc.discarding_special) {
                        useSpecWindow.discard_continue(info, info.misc.card_stash);
                    }
                    if (info.misc.special_between_turns) {
                        germHandler.epid_continue(info);
                    }
                    return;
                }
                info.misc.special_action = 0;
            }
            useSpecWindow.clean_up(info);
            if (info.misc.discarding_special) {
                useSpecWindow.discard_continue(info, info.misc.card_stash);
            }
            if (info.misc.special_between_turns) {
                germHandler.epid_continue(info);
            }
            return;
        }
        if (info.misc.special_action > 0) {
            return;
        }
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
