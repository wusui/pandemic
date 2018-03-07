var clickButton = function() {

    function buttonHeal(info, citymap) {
        alert('1 heal')
    }

    function buttonBuild(info, citymap) {
        var iam = info.players.plist[info.players.plyr_move]
        var newr = iam.xlocation
        info.misc.research_stations.push(newr)
        if (iam.name == 'O') {
            return
        }
        clickCard.discard(info)
    }

    function buttonCure(info, citymap) {
        alert('3 cure')
    }

    function buttonReset(info, citymap) {
        info.misc.card_played = -1
        info.misc.dispatched_player = -1
    }

    function buttonSkip(info, citymap) {
        info.players.moves_left = info.players.moves_left - 1
    }

    function buttonHelp(info, citymap) {
        alert('6 help')
    }

    function buttonQuit(info, citymap) {
        alert('7 quit')
    }


    var button_tbl = {'Heal': buttonHeal, 'Build': buttonBuild, 'Cure': buttonCure, 'Reset': buttonReset, 'Skip': buttonSkip, 'Help': buttonHelp, 'Quit': buttonQuit}
    function clickButton(button, info, citymap) {
        button_tbl[button](info, citymap)
        handleInput.update_page(info)
        return
    }

    return {
        clickButton:clickButton
    }

}()
