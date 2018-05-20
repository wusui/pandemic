/* globals drawBoard, clickPlayer, clickCard, utilities, boardLocations, clickCity, useSpecWindow, moveOps, clickButton, germHandler */
/* exported handleInput */
var handleInput = function() {

    var TIMEOUT = 250;
    var TIMELOCK = "timelock";
    var OUTBREAK_IND = "OUTBREAK";

    function mop_up(info) {
        var mloc = -1;
        for (var j=0; j < info.players.plist.length; j++) {
            if (info.players.plist[j].name == 'M') {
                mloc = info.players.plist[j].xlocation;
                break;
            }
        }
        for (var i=0; i < utilities.NO_OF_GERM_TYPES; i++) {
            var colr = utilities.get_color_name(i);
            if (mloc >= 0) {
                if (info.diseases[colr].cured > 0) {
                    if (info.diseases[colr].infections.hasOwnProperty(mloc)) {
                        var count = info.diseases[colr].infections[mloc];
                        delete info.diseases[colr].infections[mloc];
                        info.diseases[colr].count += count;
                    }
                }
            }
            if (info.diseases[colr].count == utilities.MAX_GERMS_TOTAL) {
                if (info.diseases[colr].cured > 0) {
                    info.diseases[colr].eradicated = 1;
                }
            }
        }
    }

    function update_page(info) {
        mop_up(info);
        var results = JSON.stringify(info);
        sessionStorage.setItem('game_data', results);
        drawBoard.drawBoard();
    }

    function mouseSwitch(evt) {
        var info = JSON.parse(sessionStorage.getItem('game_data'));
        var citymap = JSON.parse(sessionStorage.getItem('citymap'));
        if (sessionStorage.getItem(TIMELOCK) == 'on') {
            return;
        }
        sessionStorage.setItem(TIMELOCK, 'on');
        setTimeout(function(){ sessionStorage.setItem(TIMELOCK, 'off'); }, TIMEOUT);
        mEventSw(evt, info, citymap);
        if (info.misc.we_won) {
            useSpecWindow.exit_message(info, citymap, ["WE WON"]);
            update_page(info);
            return;
        }
        if (info.players.moves_left > 0) {
            info.misc.no_skip_done_yet = true;
            update_page(info);
        }
        else {
            update_page(info);
            if (info.misc.special_action > 0) {
                return;
            }
            if (info.card_decks.player_cards.length < 2) {
                useSpecWindow.exit_message(info, citymap, ["YOU LOSE", "Not enough cards left", "in the player deck"]);
                update_page(info);
                return;
            }
            var newcards = [];
            var epids = 0;
            for (var i=0; i<2; i++) {
                var card = info.card_decks.player_cards.shift();
                if (card == utilities.EPIDEMIC) {
                    epids++;
                }
                else {
                    newcards.push(card);
                }
            }
            var iam = info.players.plyr_move;
            for (i=0; i<newcards.length; i++) {
                var ncard = newcards[i];
                info.players.plist[iam].cards.push(ncard);
            }
            var toguy = info.players.plist[iam];
            info.display.too_many_in_hand = toguy.cards.slice();
            info.misc.epid_cnt_for_callback = epids;
            if (info.display.too_many_in_hand.length > useSpecWindow.HAND_LIMIT) {
                if (info.misc.use_special_window == 1) {
                    return;
                }
                info.misc.use_special_window = 1;
                useSpecWindow.tooManyCards(info, citymap);
            }
            else {
                continue_after_cardcheck(info);
            }
        }
    }

    function continue_after_cardcheck(info) {
        var citymap = JSON.parse(sessionStorage.getItem('citymap'));
        if (info.misc.epid_cnt_for_callback > 0) {
            germHandler.epidemic(info, citymap);
        }
        info.misc.epid_cnt_for_callback = -1;
        if (info.misc.quiet_night) {
            info.misc.quiet_night = false;
        }
        else {
            var epidindx = info.misc.epid_counter;
            var epidrate = info.misc.epid_values[epidindx];
            info.misc.nxt_out = [];
            for (var i=0; i<epidrate; i++) {
                var ncard = info.card_decks.infections.shift();
                info.card_decks.inf_disc.push(ncard);
                var dindx = utilities.card_to_color(ncard);
                var dizloc = ncard.toString();
                if (Object.keys(info.diseases[dindx].infections).includes(dizloc)) {
                    if (info.diseases[dindx].infections[dizloc] == 3) {
                        info.misc.nxt_out.push([dindx, dizloc]);
                        continue;
                    }
                }
                germHandler.infect(info, dindx, dizloc, 1);
            }
        }
        continue_after_outbreaks(info, citymap);
    }

    function continue_after_outbreaks(info, citymap) {
        if (info.misc.nxt_out.length > 0) {
            germHandler.infect(info, info.misc.nxt_out[0][0], info.misc.nxt_out[0][1], 1);
        }
        info.misc.op_exp_used_power = 0;
        if (info.misc.no_skip_done_yet) {
            if (info.players.moves_left == 0) {
                info.players.plyr_move++;
            }
            info.misc.no_skip_done_yet = false;
        }
        if (info.players.plyr_move == info.players.plist.length) {
            info.players.plyr_move = 0;
        }
        info.players.moves_left = utilities.PLAYER_TURNS;
        if (info.misc.loseInfo.length > 0) {
            if (info.misc.loseInfo === OUTBREAK_IND) {
                useSpecWindow.exit_message(info, citymap, ["YOU LOSE", "Too many outbreaks."]);
            }
            else {
                useSpecWindow.exit_message(info, citymap, ["YOU LOSE", "Too many " + info.misc.loseInfo +" infections."]);
            }
        }
        update_page(info);
    }

    function mEventSw(evt, info, citymap) {
        var x = evt.clientX;
        var y = evt.clientY;
        x = x - boardLocations.MOUSE_OFFSET;
        y = y - boardLocations.MOUSE_OFFSET;
        if (x < boardLocations.MAP_WIDTH) {
            if (info.misc.use_special_window > 0) {
                return;
            }
            if (y < boardLocations.MAP_HEIGHT) {
                var xoff = Math.floor(x / boardLocations.SQ_SIZE);
                var yoff = Math.floor(y / boardLocations.SQ_SIZE);
                var xinsq = x % boardLocations.SQ_SIZE;
                var yinsq = y % boardLocations.SQ_SIZE;
                var lb = boardLocations.SQ_SIZE - boardLocations.CITY_SIZE;
                lb /= 2;
                var ub = lb + boardLocations.CITY_SIZE;
                if (xinsq < lb || yinsq < lb || xinsq > ub || yinsq > ub) {
                    return;
                }
                var sqind = yoff * utilities.BOARD_WIDTH + xoff;
                if (Object.keys(citymap.bycoord).includes(sqind.toString())) {
                    clickCity.clickCity(citymap.bycoord[sqind.toString()], info, citymap);
                }
            }
            else {
                var lxcoord = -1;
                var spacing = boardLocations.PLAYER_AREA_XSIZE / info.players.plist.length;
                var txtsize = boardLocations.CARD_WIDTH;
                if (y < boardLocations.EDGE_OF_NAMES) {
                    txtsize = boardLocations.PNAME_WIDTH;
                }
                var indent = Math.floor((spacing - txtsize) / 2);
                for (var ncount=0; ncount<info.players.plist.length; ncount++) {
                    var xover = ncount * spacing + indent + boardLocations.CITY_SIZE;
                    if (x > xover && x < xover+txtsize) {
                        lxcoord = ncount;
                        break;
                    }
                }
                if (lxcoord < 0) {
                    return;
                }
                if (y < boardLocations.EDGE_OF_NAMES) {
                    clickPlayer.clickPlayer(lxcoord, info, citymap);
                    return;
                }
                if (y < boardLocations.PLAYER_Y_COORD) {
                    return;
                }
                var yindx = y - boardLocations.PLAYER_Y_COORD;
                if ((yindx % boardLocations.CARD_SPACING) > boardLocations.CARD_OFFSET) {
                    return;
                }
                var cindx = Math.floor(yindx / boardLocations.CARD_SPACING);
                if (cindx >= info.players.plist[lxcoord].cards.length) {
                    return;
                }
                var deck = info.players.plist[lxcoord].cards.sort(function(a,b){return a-b;});
                clickCard.clickCard(deck[cindx], info, citymap);
            }
        }
        else {
            var but_ind = Object.keys(boardLocations.BUTTONS);
            for (var i=0; i < but_ind.length; i++) { 
                var butn = but_ind[i];
                if (info.misc.use_special_window > 0) {
                    if (!(['Quit', 'Help'].includes(butn))) {
                        continue;
                    }
                }
                var tx = boardLocations.BUTTONS[butn][0] - boardLocations.MARGIN;
                var ty = boardLocations.BUTTONS[butn][1] - boardLocations.MARGIN;
                var txl = tx + boardLocations.BUTTON_X_LEN;
                var tyl = ty + boardLocations.BUTTON_Y_HGT;
                if (x >= tx && x <= txl && y >= ty && y <=tyl) {
                    if (moveOps.is_button_useable(butn)) {
                        clickButton.clickButton(butn, info, citymap);
                    }
                    return;
                }
            }
            x += boardLocations.MARGIN;
            y += boardLocations.MARGIN;
            var xx = x - boardLocations.TEXT_WINDOW_LEFT;
            if (xx > 0 && xx < boardLocations.TEXT_WINDOW_WIDTH) {
                var yy = y - boardLocations.TEXT_WINDOW_TOP;
                if (yy > 0 && yy <  boardLocations.TEXT_WINDOW_HEIGHT) {
                    // alert(x.toString()+":"+y.toString());
                    useSpecWindow.do_callback(x,y,info);
                }
            }
        }
    }

    return {
        OUTBREAK_IND:OUTBREAK_IND,
        mouseSwitch:mouseSwitch,
        update_page:update_page,
        continue_after_cardcheck:continue_after_cardcheck,
        continue_after_outbreaks:continue_after_outbreaks
    };
}();
