/* globals utilities, boardLocations, handleInput, htmlInterface, moveOps */
/* exported drawBoard */
var drawBoard = function() {

    var pcanvas;
    var ctx;

    var SMALL_FONT = "bold 10px Arial";
    var MEDIUM_FONT = "bold 14px Arial";
    var BIG_FONT = "bold 18px Arial";

    var BLACK = "#000000";
    var WHITE = "#ffffff";
    var BKGRND_GREEN = "#f4fff4";
    var BKGRND_BLUE = "#f4f4ff";
    var GREY = "#c0c0c0";
    var MEDIUM_GREEN = "#c0ffc0";
    var PURPLE = "#ff00ff";
    var OFF_YELLOW = "#ffffa0";

    var SPEC_BUTTONS_HEAD = 20;
    var DISEASES_HEAD = 135;
    var OTHER_STATS_HEAD = 270;
    var SEPLINE1 = 110;
    var SEPLINE2 = 245;
    var SEP_X_START = 1015;
    var SEP_X_END = 1290;
    var START_OTHER = 300;
    var SEP_STATS = 20;

    function init() {
        pcanvas = document.getElementById("myMap");
        ctx = pcanvas.getContext("2d");
        pcanvas.addEventListener("click", handleInput.mouseSwitch, false);
        pcanvas.addEventListener("keypress", htmlInterface.debug, false);
        drawBoard();
    }

    function get_ctx() {
        return ctx;
    }

    function centerRightTxt(contxt, instring, yval) {
        var wval = boardLocations.WIDTH_RIGHT_PART;
        var sleng = contxt.measureText(instring).width;
        var spos = boardLocations.RIGHT_PART_START;
        var loffset = (wval - sleng) / 2;
        contxt.fillText(instring, Math.floor(loffset)+spos, yval);
    }

    function draw_sep_line(ctx, yspot) {
        ctx.strokeStyle = BLACK;
        ctx.beginPath();
        ctx.moveTo(SEP_X_START, yspot);
        ctx.lineTo(SEP_X_END, yspot);
        ctx.stroke();
    }

    function disp_oth_stats(ctx, otherstats) {
        var yspace = START_OTHER;
        for (var i=0; i < otherstats.length; i++) {
            var fstring = otherstats[i].join('');
            centerRightTxt(ctx, fstring, yspace);
            yspace += SEP_STATS;
        }
    }

    function drawButton(otext,locs,color) {
        ctx.strokeRect(locs[0], locs[1], boardLocations.BUTTON_X_LEN, boardLocations.BUTTON_Y_HGT);
        if (color) {
            ctx.fillStyle = WHITE;
        }
        else {
            ctx.fillStyle = GREY;
        }
        ctx.fillRect(locs[0], locs[1], boardLocations.BUTTON_X_LEN, boardLocations.BUTTON_Y_HGT);
        ctx.fillStyle = BLACK;
        ctx.fillText(otext, locs[2], locs[1] + boardLocations.BUTTON_YDIFF);
    }

    function drawBoard() {
        var info = JSON.parse(sessionStorage.getItem('game_data'));
        var citymap = JSON.parse(sessionStorage.getItem('citymap'));
        ctx.fillStyle = BKGRND_GREEN;
        ctx.fillRect(0, 0, pcanvas.width, pcanvas.height);
        ctx.fillStyle = BKGRND_BLUE;
        ctx.rect(boardLocations.MARGIN, boardLocations.MARGIN, boardLocations.MAP_WIDTH, boardLocations.MAP_HEIGHT);
        ctx.fillRect(boardLocations.MARGIN, boardLocations.MARGIN, boardLocations.MAP_WIDTH, boardLocations.MAP_HEIGHT);
        ctx.stroke();
        ctx.strokeStyle = PURPLE;
        var klist = Object.keys(citymap.byname);
        for (var ii=0; ii < klist.length; ii++) {
            var key = klist[ii];
            var neighbors = citymap.byname[key].neighbors;
            for (var tocity=0; tocity < neighbors.length; tocity++) {
                var x1 = boardLocations.conv_to_map(citymap.byname[neighbors[tocity]].xcoord);
                var y1 = boardLocations.conv_to_map(citymap.byname[neighbors[tocity]].ycoord);
                var x2 = boardLocations.conv_to_map(citymap.byname[key].xcoord);
                var y2 = boardLocations.conv_to_map(citymap.byname[key].ycoord);
                if (Math.abs(x1-x2) < boardLocations.WRAP_SIZE) {
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
                else {
                    var newy = Math.floor((y1+y2)/2);
                    var smally = y2;
                    if (x1 == boardLocations.OFFSET_TO_CENTER) {
                        smally = y1;
                    }
                    var bigy = y1 + y2 - smally;
                    ctx.beginPath();
                    ctx.moveTo(boardLocations.MARGIN, newy);
                    ctx.lineTo(boardLocations.OFFSET_TO_CENTER,smally);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(boardLocations.WRAP_SIZE+boardLocations.OFFSET_TO_CENTER,bigy);
                    ctx.lineTo(boardLocations.MAP_WIDTH+boardLocations.MARGIN,newy);
                    ctx.stroke();
                }
            }
        }

        var lklist = Object.keys(citymap.byname);
        for (var li=0; li < lklist.length; li++) {
            var key1 = lklist[li];
            var xc = boardLocations.conv_to_map(citymap.byname[key1].xcoord) - boardLocations.CITY_SIZE/2;
            var yc = boardLocations.conv_to_map(citymap.byname[key1].ycoord) - boardLocations.CITY_SIZE/2;
            var cname = citymap.byname[key1].name;
            var numb = parseInt(citymap.byname[key1].number);
            ctx.fillStyle = WHITE;
            if (info.misc.research_stations.includes(numb)) {
                ctx.fillStyle = MEDIUM_GREEN;
            }
            ctx.fillRect(xc, yc, boardLocations.CITY_SIZE, boardLocations.CITY_SIZE);
            var dtype = Math.floor(numb/utilities.CITIES_PER_DISEASE);
            ctx.strokeStyle = utilities.get_card_color(dtype);
            ctx.strokeRect(xc, yc, boardLocations.CITY_SIZE, boardLocations.CITY_SIZE);
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = SMALL_FONT;
            ctx.fillText(cname, xc, yc-boardLocations.TEXT_ADJUSTMENT1);
        }

        var cur_locs = {};
        for (var iloc = 0; iloc <  info.players.plist.length; iloc++) {
            var lname = info.players.plist[iloc].name;
            var lloc = info.players.plist[iloc].xlocation;
            if (lloc in cur_locs) {
                cur_locs[lloc] = cur_locs[lloc] + lname;
            }
            else {
                cur_locs[lloc] = lname;
            }
        }
        ctx.font = BIG_FONT;
        ctx.fillStyle = BLACK;
        var loclst = Object.keys(cur_locs);
        for (var llcnt=0; llcnt < loclst.length; llcnt++) {
            var cnumb = loclst[llcnt];
            var ocity = citymap.bynumb[cnumb];
            var xv = parseInt(citymap.byname[ocity].xcoord);
            var yv = parseInt(citymap.byname[ocity].ycoord);
            var otext = cur_locs[cnumb];
            var sval = Math.floor(ctx.measureText(otext).width/2);
            ctx.fillText(otext, boardLocations.conv_to_map(xv)-sval, boardLocations.conv_to_map(yv)+boardLocations.PLAYER_OFFSET);
        }
        for (var dcount=0; dcount<utilities.NO_OF_GERM_TYPES; dcount++) {
            var dname = utilities.get_color_name(dcount);
            ctx.fillStyle = utilities.get_card_color(dcount);
            var inf2add = info.diseases[dname].infections;
            var ckeylst = Object.keys(inf2add);
            for (var icity=0; icity < ckeylst.length; icity++) {
                var citnm = ckeylst[icity];
                var cityz = citymap.bynumb[citnm];
                var xloc = boardLocations.conv_to_map(parseInt(citymap.byname[cityz].xcoord));
                var yloc = boardLocations.conv_to_map(parseInt(citymap.byname[cityz].ycoord));
                var xoff = boardLocations.get_dis_locs(dcount);
                var cnt = parseInt(info.diseases[dname].infections[citnm]);
                for (var gcount=0; gcount<cnt; gcount++) {
                    var yoff = boardLocations.get_dis_locs(utilities.MAX_GERMS-gcount);
                    ctx.fillRect(xloc+xoff, yloc+yoff, boardLocations.DISEASE_SIZE, boardLocations.DISEASE_SIZE);
                }
            }
        }

        ctx.font = BIG_FONT;
        var pcount = info.players.plist.length;
        var spacing = boardLocations.PLAYER_AREA_XSIZE / pcount;
        var pentry;
        var maxn;
        var indent;
        var xover;
        for (var ncount=0; ncount<pcount; ncount++) {
            pentry = info.players.plist[ncount];
            var pname = pentry.name;
            var occ = utilities.occupation_name(pname);
            maxn = Math.floor(ctx.measureText(occ).width+1);
            indent = Math.floor((spacing - maxn) / 2);
            xover = ncount * spacing + indent + boardLocations.CITY_SIZE;
            ctx.fillStyle = GREY;
            if (ncount == parseInt(info.players.plyr_move)) {
                ctx.fillStyle = BLACK;
            }
            ctx.fillText(occ, xover, boardLocations.PLAYER_Y_COORD);
        }
        ctx.font = MEDIUM_FONT;
        var ctext;
        for (ncount=0; ncount<pcount; ncount++) {
            pentry = info.players.plist[ncount];
            var deck = pentry.cards.sort(function(a,b){return a-b;});
            var vline = boardLocations.PLAYER_Y_COORD;
            for (var card=0; card < deck.length; card++) {
                if (deck[card] >= utilities.FIRST_SPECIAL_CARD) {
                    ctext = utilities.id_event_card(deck[card]);
                }
                else {
                    ctext = citymap.bynumb[deck[card]];
                }
                maxn = Math.floor(ctx.measureText(ctext).width+1);
                indent = Math.floor((spacing - maxn) / 2);
                xover = ncount * spacing + indent + boardLocations.CITY_SIZE;
                vline += boardLocations.CARD_SPACING;
                var nindent = Math.floor((spacing - boardLocations.CARD_WIDTH) / 2);
                var cdsp = ncount * spacing + nindent + boardLocations.CITY_SIZE;
                cdsp = Math.floor(cdsp);
                ctx.fillStyle = OFF_YELLOW;
                ctx.fillRect(cdsp, vline-boardLocations.CARD_OFFSET, boardLocations.CARD_WIDTH, boardLocations.CARD_HEIGHT);
                var cindex = Math.floor(deck[card]/utilities.CITIES_PER_DISEASE);
                ctx.fillStyle = utilities.get_card_color(cindex);
                ctx.fillText(ctext, xover, vline);
            }
        }

        ctx.fillStyle = BLACK;
        centerRightTxt(ctx, 'Special Buttons', SPEC_BUTTONS_HEAD);
        ctx.strokeStyle = BLACK;
        moveOps.init(info, citymap);
        var bkey;
        var but_keys = Object.keys(boardLocations.BUTTONS);
        for (bkey=0; bkey < but_keys.length; bkey++) {
            var binfo = but_keys[bkey];
            var colval = moveOps.is_button_useable(binfo);
            drawButton(binfo,boardLocations.BUTTONS[binfo],colval);
        }
        draw_sep_line(ctx, SEPLINE1);

        centerRightTxt(ctx, 'Diseases', DISEASES_HEAD);
        var dis_y_cnt = boardLocations.DIS_Y_START;
        for (var i=0; i<utilities.NO_OF_GERM_TYPES; i++) {
            var colorp = utilities.get_color_name(i);
            var tcol = info.diseases[colorp];
            var dstatus = 'ACTIVE';
            if (tcol.eradicated > 0) {
                dstatus = 'ERADICATED';
            }
            else {
                if (tcol.cured> 0) {
                    dstatus = 'CURED';
                }
            }
            var cstr = tcol.count.toString();
            ctx.fillStyle = utilities.get_card_color(i);
            var msg1 = [colorp, dstatus].join('/');
            var msg2 = [msg1, cstr].join(':');
            ctx.fillText(msg2, boardLocations.DIS_X_START, dis_y_cnt);
            dis_y_cnt += boardLocations.DIS_Y_SPACES;
        }
        draw_sep_line(ctx, SEPLINE2);

        ctx.fillStyle = BLACK;
        centerRightTxt(ctx, 'Other Statistics', OTHER_STATS_HEAD);

        var otherstats = [];
        otherstats.push(["Outbreaks: ", info.misc.outbreak_count.toString()]);
        var epidindx = info.misc.epid_counter;
        var epidrate = info.misc.epid_values[epidindx];
        otherstats.push(["Infection Rate: ", epidrate, '(', epidindx.toString(), ')']);
        otherstats.push(["Cards Left: ",info.card_decks.player_cards.length.toString()]);
        var rsl = info.misc.research_stations.length;
        var rslcnt = utilities.R_STA_MAX - rsl;
        otherstats.push(["Research Stations Left: ", rslcnt.toString()]);
        otherstats.push(["Actions Left: ",info.players.moves_left.toString()]);
        var display_value = info.players.plyr_move + 1;
        otherstats.push(["Player #: ", display_value.toString()]);
        disp_oth_stats(ctx, otherstats);

        ctx.strokeRect(boardLocations.TEXT_WINDOW_LEFT, boardLocations.TEXT_WINDOW_TOP, boardLocations.TEXT_WINDOW_WIDTH, boardLocations.TEXT_WINDOW_HEIGHT); 
        ctx.fillStyle = WHITE;
        ctx.fillRect(boardLocations.TEXT_WINDOW_LEFT, boardLocations.TEXT_WINDOW_TOP, boardLocations.TEXT_WINDOW_WIDTH, boardLocations.TEXT_WINDOW_HEIGHT); 
        ctx.fillStyle = BLACK;
        var txt_data = info.display.special_text_fields;
        for (var itxt=0; itxt<txt_data.length; itxt++) {
            if (txt_data[itxt].highlight) {
                ctx.fillStyle = OFF_YELLOW;
                ctx.fillRect(info.display.card_start, txt_data[itxt].top-boardLocations.CARD_OFFSET, boardLocations.CARD_WIDTH, boardLocations.CARD_HEIGHT);
            }
            ctx.font = txt_data[itxt].font;
            ctx.fillStyle = txt_data[itxt].color;
            ctx.fillText(txt_data[itxt].text, txt_data[itxt].left, txt_data[itxt].top);
        }
        for (var ibut=0; ibut<info.display.special_text_buttons.length; ibut++) {
            var binf = info.display.special_text_buttons[ibut];
            drawButton(binf.text, binf.locations, true);
        }

        var no_contingency = true;
        for (var iii=0; iii < info.players.plist.length; iii++) {
            if (info.players.plist[iii].name == 'C') {
                no_contingency = false;
                break;
            }
        }
        if (no_contingency) {
            return;
        }

        var no_card_avail = true;
        for (ii=0; ii<info.card_decks.player_disc.length; ii++) {
            if (info.card_decks.player_disc[ii] >= utilities.FIRST_SPECIAL_CARD) {
                no_card_avail = false;
                break;
            }
        }
        var cardval = "+";
        if (no_card_avail) {
            ctx.fillStyle = GREY;
        }
        else {
            ctx.fillStyle = utilities.get_card_color(utilities.EVENT_CARD_TYPE);
        }
        if (info.misc.contingency_card > 0) {
            cardval = utilities.xcard_color[info.misc.contingency_card - utilities.FIRST_SPECIAL_CARD];
        }
        ctx.fillText(cardval, boardLocations.CONTINGENCY_CARD_X, boardLocations.CONTINGENCY_CARD_Y);
    }

    return {
        init:init,
        get_ctx:get_ctx,
        MEDIUM_FONT:MEDIUM_FONT,
        drawBoard:drawBoard
    };
}();
