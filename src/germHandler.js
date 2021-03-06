/* globals utilities, useSpecWindow, handleInput, specialSpecial */
/* exported germHandler */
var germHandler = function() {
    function infect(info, dcolor, dizloc, numb) {
        if (info.diseases[dcolor].eradicated == 1) {
            return;
        }
        if (Object.keys(info.diseases[dcolor].infections).includes(dizloc)) {
            info.diseases[dcolor].infections[dizloc] += numb;
            if (info.diseases[dcolor].infections[dizloc] >
                           utilities.MAX_GERMS) {
                var diff = utilities.MAX_GERMS -
                           info.diseases[dcolor].infections[dizloc];
                info.diseases[dcolor].count -= numb;
                info.diseases[dcolor].count -= diff;
                info.diseases[dcolor].infections[dizloc] = utilities.MAX_GERMS;
                outbreak(info, dcolor, dizloc);
                if (info.misc.outbreak_count > utilities.MAX_OUTBREAKS) {
                    info.misc.loseInfo = handleInput.OUTBREAK_IND;
                }
            }
            else {
                info.diseases[dcolor].count -= numb;
            }
        }
        else {
            info.diseases[dcolor].infections[dizloc] = numb;
            info.diseases[dcolor].count -= numb;
        }
        if (info.diseases[dcolor].count < 0) {
            info.misc.loseInfo = dcolor;
        }
        handleInput.update_page(info);
    }

    function outbreak(info, dcolor, dizloc) {
        var citymap = JSON.parse(sessionStorage.getItem('citymap'));
        var outb_stk = [];
        var citind = citymap.bynumb[dizloc.toString()];
        outb_stk.push(citind);
        var indx = 0;
        while (indx < outb_stk.length) {
            var obme = outb_stk[indx];
            var obloc = citymap.byname[obme].neighbors;
            for (var i=0; i < obloc.length; i++) {
                var base_dis = info.diseases[dcolor].infections;
                var cit_numbs = Object.keys(base_dis);
                var i2 = citymap.byname[obloc[i]].number.toString();
                var i3 = cit_numbs.indexOf(i2);
                if (i3 >= 0) {
                    if (base_dis[i2] == utilities.MAX_GERMS) {
                        if (outb_stk.indexOf(obloc[i]) < 0) {
                            outb_stk.push(obloc[i]);
                        }
                        continue;
                    }
                }
                if (outb_stk.indexOf(i2) < 0) {
                    infect(info, dcolor, i2, 1);
                }
            }
            indx++;
        }
        info.misc.outbreak_count += outb_stk.length;
        var omsg = ['Outbreak occurred in '+outb_stk[0]];
        for (var j=1; j<outb_stk.length; j++) {
            omsg.push('Chain reaction outbreak occurred');
            omsg.push('in '+outb_stk[j]);
        }
        useSpecWindow.eot_outbrk_message(info, citymap, omsg);
        handleInput.update_page(info);
    }

    function epidemic(info,citymap) {
        info.misc.epid_counter++;
        info.misc.epid_city = info.card_decks.infections.pop();
        info.card_decks.inf_disc.push(info.misc.epid_city);
        var city = citymap.bynumb[info.misc.epid_city.toString()];
        useSpecWindow.epidemic_message(info, citymap,
                                       ['Epidemic occurred in '+city]);
    }

    function epidemic_callback(info) {
        var dcolor = utilities.card_to_color(info.misc.epid_city);
        utilities.shuffle(info.card_decks.inf_disc);
        for (var i=0; i<info.card_decks.inf_disc.length; i++) {
            info.card_decks.infections.unshift(info.card_decks.inf_disc[i]);
        }
        info.card_decks.inf_disc = [];
        info.misc.epid_cnt_for_callback--;
        infect(info, dcolor, info.misc.epid_city.toString(), 3);
        handleInput.update_page(info);
        epid_continue(info);
    }

    function epid_continue(info) {
        var sp_cards =[];
        for (var i=0; i<info.players.plist.length; i++) {
            var cardv = info.players.plist[i].cards;
            for (var j=0; j<cardv.length; j++) {
                if (cardv[j] >= utilities.MAX_INF_CITIES) {
                    sp_cards.push(cardv[j]);
                }
            }
        }
        if (sp_cards.length === 0) {
            handleInput.continue_after_cardcheck(info);
        }
        else {
            specialSpecial.set_up_between_move_specials(info, sp_cards);
        }
    }

    return {
        infect:infect,
        epidemic:epidemic,
        epidemic_callback:epidemic_callback,
        epid_continue:epid_continue
    };
}();
