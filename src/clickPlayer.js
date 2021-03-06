/* globals handleInput, utilities, useSpecWindow */
/* exported clickPlayer */
var clickPlayer = function() {

    function clickPlayer(action, info, citymap) {
        if (info.misc.special_action ==  utilities.SA_AIRLIFT_PLAYER) {
            info.misc.special_action = utilities.SA_AIRLIFT_LOCATION;
            info.misc.airlifted_player = action;
            var occupation = utilities.occupation_name(
                        info.players.plist[action].name);
            var msg1 = occupation + " has been selected";
            var msg2 = occupation + " will be airlifted.";
            useSpecWindow.special_message(info, citymap,
                        [msg1, "to be airlifted.", " ",
                         "Click on the city to which", msg2]);
            handleInput.update_page(info);
            return;
        }
        if (info.misc.special_action > 0) {
            return;
        }
        if (action == info.players.plyr_move) {
            return;
        }
        if (info.misc.card_played >= 0) {
            var iam = info.players.plyr_move;
            var mloc = info.players.plist[iam].xlocation;
            var oloc = info.players.plist[action].xlocation;
            if (mloc != oloc) {
                return;
            }
            var takeok = false;
            if (mloc == info.misc.card_played) {
                takeok = true;
            }
            else {
                if (info.players.plist[iam].name == 'R') {
                    takeok = true;
                }
            }
            if (takeok) {
                var fromguy = info.players.plist[iam].cards;
                fromguy.splice(fromguy.indexOf(info.misc.card_played),1);
                var toguy = info.players.plist[action];
                toguy.cards.push(info.misc.card_played);
                info.misc.card_played = -1;
                info.display.too_many_in_hand = toguy.cards.slice();
                if (info.display.too_many_in_hand.length >
                                useSpecWindow.HAND_LIMIT) {
                    info.misc.card_pass_in_progress = true;
                    useSpecWindow.tooManyCards(info, citymap);
                    return;
                }
                info.players.moves_left--;
                handleInput.update_page(info);
            }
        }
        if (info.players.plist[info.players.plyr_move].name == 'D') {
            if (info.misc.dispatched_player != -1) {
                info.misc.card_played = -1;
            }
            info.misc.dispatched_player = action;
            handleInput.update_page(info);
        }
        return;
    }

    return {
        clickPlayer:clickPlayer
    };

}();
