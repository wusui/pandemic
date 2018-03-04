var moveOps = function() {

    var info
    var citymap

    function init(sinfo, scitymap) {
        info = sinfo
        citymap = scitymap
    }

    function canBuild() {
        var pnumb = info.players.plyr_move
        var weare = info.players.plist[pnumb] 
        if (info.misc.research_stations.includes(weare.xlocation)) {
            return false
        }
        if (weare.name == 'O') {
            return true
        }
        if (info.misc.card_played == weare.xlocation) {
            return true
        }
        return false
    }

    function canCure() {
        var pnumb = info.players.plyr_move
        var weare = info.players.plist[pnumb] 
        if (!(info.misc.research_stations.includes(weare.xlocation))) {
            return false
        }
        var hist = [0, 0, 0, 0]
        var cmax = 0
        var snumb = 0
        for (var indx=0; indx < weare.cards.length; indx++) {
            var dindx = Math.floor(weare.cards[indx] / utilities.CITIES_PER_DISEASE)
            if (dindx < utilities.NO_OF_GERM_TYPES) {
                hist[dindx]++
                if (hist[dindx] > cmax) {
                    cmax = hist[dindx]
                    snumb = dindx
                }
            }
        }
        var toCure = utilities.NO_CARDS_TO_CURE
        if (weare.name == 'S') {
            toCure--
        }
        if (cmax >= toCure) {
            var ccolor = utilites.get_color_name(snumb)
            if (info.diseases[ccolor].cured > 0) {
                return false
            }
            return ccolor
        }
        return false
    }

    function canHeal() {
        var iamat = info.players.plist[info.players.plyr_move].xlocation
        for (var i=0; i<utilities.NO_OF_GERM_TYPES; i++) {
            var dname = utilities.get_color_name(i)
            var klist = Object.keys(info.diseases[dname].infections)
            for (var j=0; j<klist.length; j++) {
                if (iamat == klist[j]) {
                    return true
                }
            }
        }
        return false
    }

    function canReset() {
        if (info.misc.card_played < 0) {
            return false
        }
        return true
    }

    var button_table = {'Heal': canHeal, 'Build': canBuild, 'Cure': canCure, 'Reset': canReset}
    function is_button_useable(keyname) {
        if (!(Object.keys(button_table).includes(keyname))) {
            return true
        }
        return button_table[keyname]()
    }

    return {
        init:init,
        canBuild:canBuild,
        canHeal:canHeal,
        canCure:canCure,
        is_button_useable:is_button_useable
    }
}()
