/* global handleInput, utilities */
/* exported clickCard */
var clickCard = function() {

    function discard(info) {
        info.card_decks.player_disc.push(info.misc.card_played);
        var indx = info.players.plyr_move;
        rindx = info.players.plist[indx].cards.indexOf(info.misc.card_played);
        if (rindx >= 0) {
            info.players.plist[indx].cards.splice(rindx, 1);
        }
        info.misc.card_played = -1;
        handleInput.update_page(info);
    }

    function clickCard(action, info, citymap) {
        var curp = info.players.plyr_move;
        var hand = info.players.plist[curp].cards;
        if (hand.includes(action)) {
            if (action < utilities.MAX_INF_CITIES) {
                if (info.misc.card_played != -1) {
                    info.misc.dispatched_player = -1;
                }
                info.misc.card_played = action;
                handleInput.update_page(info);
                return;
            }
        }
        for (var ii=0; ii<info.players.plist.length; ii++) {
            var nmhnd = info.players.plist[ii].cards;
            if (nmhnd.includes(action)) {
                break;
            }
        }
        var iam = info.players.plyr_move;
        var mloc = info.players.plist[iam].xlocation;
        var oloc = info.players.plist[ii].xlocation;
        if (mloc != oloc) {
            return;
        }
        var takeok = false;
        if (mloc == action) {
            takeok = true;
        }
        else {
            if (info.players.plist[ii].name == 'R') {
                takeok = true;
            }
        }
        if (takeok) {
            var fromguy = info.players.plist[ii].cards;
            fromguy.splice(fromguy.indexOf(action),1);
            var toguy = info.players.plist[iam];
            toguy.cards.push(action);
            handleInput.update_page(info);
        }
    }

    return {
        discard:discard,
        clickCard:clickCard
    };

}();
