/* globals utilities, useSpecWindow, handleInput */
/* exported germHandler */
var germHandler = function() {
    function infect(info, dcolor, dizloc, numb) {
        if (info.diseases[dcolor].eradicated == 1) {
            return;
        }
        if (Object.keys(info.diseases[dcolor].infections).includes(dizloc)) {
            info.diseases[dcolor].infections[dizloc] += numb;
            if (info.diseases[dcolor].infections[dizloc] > utilities.MAX_GERMS) {
                var diff = utilities.MAX_GERMS - info.diseases[dcolor].infections[dizloc];
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
                infect(info, dcolor, i2, 1);
            }
            indx++;
        }
        info.misc.outbreak_count += outb_stk.length;
        var omsg = ['Outbreak occurred in '+outb_stk[0]];
        for (var j=1; j<outb_stk.length; j++) {
            omsg.push('Chain reaction outbreak occurred');
            omsg.push('in '+outb_stk[j]);
        }
        useSpecWindow.print_message(info, citymap, omsg);
        handleInput.update_page(info);
    }

    function epidemic(info,citymap) {
        info.misc.epid_counter++;
        info.misc.epid_city = info.card_decks.infections.pop();
        info.card_decks.inf_disc.push(info.misc.epid_city);
        var city = citymap.bynumb[info.misc.epid_city.toString()];
        useSpecWindow.epidemic_message(info, citymap, ['Epidemic occurred in '+city]);
    }

    function epidemic_callback(info) {
        var dcolor = utilities.card_to_color(info.misc.epid_city);
        utilities.shuffle(info.card_decks.inf_disc);
        for (var i=0; i<info.card_decks.inf_disc.length; i++) {
            info.card_decks.infections.unshift(info.card_decks.inf_disc[i]);
        }
        info.card_decks.inf_disc = [];
        handleInput.update_page(info);
        info.misc.play_out_of_turn = true;
        setTimeout(function(){ infect(info, dcolor, info.misc.epid_city.toString(), 3); }, 500);
        if (!(Object.keys(info.diseases[dcolor].infections).includes(info.misc.epid_city.toString()))) {
            play_out_of_turn(info);
        }
    }

    function play_out_of_turn(info) {
        alert('code to handle out of turn special card play goes here.');
        info.misc.play_out_of_turn = false;
        handleInput.update_page(info);
    }

    return {
        infect:infect,
        epidemic:epidemic,
        epidemic_callback:epidemic_callback,
        play_out_of_turn:play_out_of_turn
    };
}();
