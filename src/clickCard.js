var clickCard = function() {

    function discard(info) {
        info.card_decks.player_disc.push(info.misc.card_played)
        var indx = info.players.plyr_move
        rindx = info.players.plist[indx].cards.indexOf(info.misc.card_played)
        if (rindx >= 0) {
            info.players.plist[indx].cards.splice(rindx, 1)
        }
        info.misc.card_played = -1
        handleInput.update_page(info)
    }

    function clickCard(action, info, citymap) {
        if (action < utilities.MAX_INF_CITIES) {
            info.misc.card_played = action
            handleInput.update_page(info)
        }
    }

    return {
        discard:discard,
        clickCard:clickCard
    }

}()
