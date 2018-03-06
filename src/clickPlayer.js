var clickPlayer = function() {

    function clickPlayer(action, info, citymap) {
        if (action == info.players.plyr_move) {
            return
        }
        if (info.misc.card_played >= 0) {
            var iam = info.players.plyr_move
            var mloc = info.players.plist[iam].xlocation
            var oloc = info.players.plist[action].xlocation
            if (mloc != oloc) {
                return
            }
            var takeok = false
            if (mloc == info.misc.card_played) {
                takeok = true
            }
            else {
                if (info.players.plist[iam].name == 'R') {
                    takeok = true
                }
            }
            if (takeok) {
                alert('card passing '+citymap.bynumb[info.misc.card_played]+" to "+action.toString())
                var fromguy = info.players.plist[iam].cards
                fromguy.splice(fromguy.indexOf(info.misc.card_played),1)
                var toguy = info.players.plist[action]
                toguy.cards.push(info.misc.card_played)
                info.misc.card_played = -1
                handleInput.update_page(info)
            }
        }
        if (info.players.plist[info.players.plyr_move].name == 'D') {
            info.misc.dispatched_player = action
            handleInput.update_page(info)
        }
        return
    }

    return {
        clickPlayer:clickPlayer
    }

}()
