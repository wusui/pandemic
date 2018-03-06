var clickPlayer = function() {

    function clickPlayer(action, info, citymap) {
        if (action == info.players.plyr_move) {
            return
        }
        if (info.misc.card_played >= 0) {
            alert('card passing '+citymap.bynumb[info.misc.card_played]+" to "+action.toString())
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
