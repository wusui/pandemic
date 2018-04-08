/* global handleInput, utilities, useSpecWindow */
/* exported clickCard */
var clickCard = function() {

    function discard(info) {
        info.card_decks.player_disc.push(info.misc.card_played);
        var indx = info.players.plyr_move;
        var rindx = info.players.plist[indx].cards.indexOf(info.misc.card_played);
        if (rindx >= 0) {
            info.players.plist[indx].cards.splice(rindx, 1);
        }
        info.misc.card_played = -1;
        handleInput.update_page(info);
    }

    function specialCard(action, info, citymap) {
        var cval = action - utilities.FIRST_SPECIAL_CARD;
        if (cval === 0) {
            info.misc.quiet_night = true;
            useSpecWindow.print_message(info, citymap, ["Quiet Night Card Played"]);
        }
        if (cval === 1) {
            info.misc.airlift_player = true;
            useSpecWindow.print_message(info, citymap, ["Airlift Card Played", "After this box is cleared,", "click on the player that you", "ant to airlift"]);
        }
        if (cval === 2) {
            info.misc.gov_grant = true;
            useSpecWindow.print_message(info, citymap, ["Government Grant Card Played", "After this box is cleared,", "click on the new research", "station location"]);
        }
        info.misc.card_played = action;
        discard(info);
    }

    function clickCard(action, info, citymap) {
        if (info.misc.airlift_player || info.misc.airlift_location || info.misc.gov_grant) {
            return;
        }
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
            specialCard(action, info, citymap);
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
