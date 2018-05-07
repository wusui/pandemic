/* globals utilities, useSpecWindow */
/* exported germHandler */
var germHandler = function() {
    function infect(info, dcolor, dizloc, numb) {
        if (Object.keys(info.diseases[dcolor].infections).includes(dizloc)) {
            info.diseases[dcolor].infections[dizloc] += numb;
            if (info.diseases[dcolor].infections[dizloc] > utilities.MAX_GERMS) {
                var diff = info.diseases[dcolor].infections[dizloc] - utilities.MAX_GERMS;
                info.diseases[dcolor].count -= numb;
                info.diseases[dcolor].count += diff;
                info.diseases[dcolor].infections[dizloc] = utilities.MAX_GERMS;
                outbreak(info, dcolor, dizloc);
                return;
            }
        }
        else {
            info.diseases[dcolor].infections[dizloc] = numb;
        }
        info.diseases[dcolor].count -= numb;
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
    }

    return {
        infect:infect
    };
}();
