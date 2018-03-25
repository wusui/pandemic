/* global utilities, clickCard, useSpecWindow, moveOps, handleInput */
/* exported clickButton */
var clickButton = function() {

    function do_cure(info, cval) {
        var iam = info.players.plyr_move;
        var iamat = info.players.plist[iam].xlocation;
        var dcured = 1;
        if (info.players.plist[iam].name == 'M' || info.diseases[cval].cured > 0) {
            dcured = info.diseases[cval].infections[iamat];
        }
        info.diseases[cval].infections[iamat] -= dcured;
        info.diseases[cval].count += dcured;
        if (info.diseases[cval].infections[iamat] === 0) {
            delete info.diseases[cval].infections[iamat];
        }
    }

    function buttonHeal(info, citymap) {
        var dvals = [0, 0, 0, 0];
        var iam = info.players.plyr_move;
        var iamat = info.players.plist[iam].xlocation;
        for (var i=0; i<utilities.NO_OF_GERM_TYPES; i++) {
            var dname = utilities.get_color_name(i);
            var diskey = info.diseases[dname].infections;
            for (var ikey=0; ikey < Object.keys(diskey).length; ikey++) {
                var dloc = Object.keys(diskey)[ikey];
                if (dloc == iamat) {
                    dvals[i] = diskey[dloc];
                }
            }
        }
        var dtcount = 0;
        var lastfound = -1;
        for (var j=0; j<dvals.length; j++) {
            if (dvals[j] > 0) {
                dtcount++;
                lastfound = j;
            }
        }
        if (dtcount == 1) {
            var cval = utilities.get_color_name(lastfound);
            do_cure(info, cval);
        }
        else {
            useSpecWindow.tooManyGerms(info, citymap, dvals);
        }
        info.players.moves_left--;
    }

    function buttonBuild(info, citymap) {
        var iam = info.players.plist[info.players.plyr_move];
        var newr = iam.xlocation;
        info.misc.research_stations.push(newr);
        info.players.moves_left--;
        if (iam.name != 'O') {
            clickCard.discard(info);
        }
        if (info.misc.research_stations.length > utilities.R_STA_MAX) {
            useSpecWindow.tooManyStations(info, citymap);
        }
    }

    function buttonCure(info, citymap) {
        var iam = info.players.plist[info.players.plyr_move];
        var curecol = moveOps.canCure();
        var ccount = [];
        for (var i=0; i<iam.cards.length; i++) {
            var ccol = utilities.card_to_color(iam.cards[i]);
            if (ccol == curecol) {
                ccount.push(iam.cards[i]);
            }
        }
        var needed = utilities.NO_CARDS_TO_CURE;
        if (iam.name == 'S') {
            needed--;
        }
        if (needed == ccount.length) {
            info.diseases[curecol].cured = 1;
            for (var ii=0; ii<ccount.length; ii++) {
                info.misc.card_played = ccount[ii];
                clickCard.discard(info);
            }
        }
        else {
            alert('Too many of the right cards.  This code will be more complicated.');
        }
        info.players.moves_left--;
    }

    function buttonReset(info, citymap) {
        info.misc.card_played = -1;
        info.misc.dispatched_player = -1;
        info.misc.use_special_window = 0;
    }

    function buttonSkip(info, citymap) {
        info.players.moves_left--;
    }

    function buttonHelp(info, citymap) {
        alert('Help button still needs to be implemented');
    }

    function buttonQuit(info, citymap) {
        close();
    }


    var button_tbl = {'Heal': buttonHeal, 'Build': buttonBuild, 'Cure': buttonCure, 'Reset': buttonReset, 'Skip': buttonSkip, 'Help': buttonHelp, 'Quit': buttonQuit};

    function clickButton(button, info, citymap) {
        button_tbl[button](info, citymap);
        handleInput.update_page(info);
        return;
    }

    return {
        do_cure:do_cure,
        clickButton:clickButton
    };

}();
