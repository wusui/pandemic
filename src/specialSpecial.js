/* globals useSpecWindow, boardLocations, utilities, drawBoard, handleInput */
/* exported specialSpecial */
var specialSpecial = function() {

    var FORECAST_SIZE = 6;
    var HEADER_LINES = 6;
    var BUT_TXT_OFF = 6;
    var HDR_RES_LINES = 4;
    var BUT_LOC_FROM_BOT = 25;
    var BUT_TXT_LOC = 165;
    var PLUS_OFFSET = 10;
    var MINUS_OFFSET = 2;
    var PLUSMINUS_LEN = 10;
    var CITY_PER_PAGE = 7;
    var plus_x_loc;
    var minus_x_loc;
    var top_offset;
    var saved_citymap;
    var saved_info;
    var line_filler;

    var dbutton_y = boardLocations.TEXT_WINDOW_TOP + boardLocations.TEXT_WINDOW_HEIGHT - BUT_LOC_FROM_BOT;
    var dbutton_x = boardLocations.TEXT_WINDOW_LEFT + boardLocations.TEXT_WINDOW_WIDTH - BUT_TXT_LOC;
    var lbutton_x = dbutton_x - 110;
    var rbutton_x = dbutton_x + 100;
    var tloc = dbutton_x + BUT_TXT_OFF;
    var done_button = {"text": "DONE", "locations": [dbutton_x, dbutton_y, tloc]};
    var prev_button = {"text": "PREV", "locations": [lbutton_x, dbutton_y, tloc-110]};
    var next_button = {"text": "NEXT", "locations": [rbutton_x, dbutton_y, tloc+100]};
    var frontcards = [];
    var inf_cards = [];
    var page_no = 0;

    function hit_button(x, y, info) {
        for (var ib=0; ib<info.display.special_text_buttons.length; ib++) {
            var bloc = info.display.special_text_buttons[ib];
            if (x > bloc.locations[0] && x < bloc.locations[0] + boardLocations.BUTTON_X_LEN) {
                if (y > bloc.locations[1] && y < bloc.locations[1] + boardLocations.BUTTON_Y_HGT) {
                    return ib;
                }
            }
        }
        return -1;
    }

    function setCards() {
        var nline_no = HEADER_LINES;
        for (var i=0; i<frontcards.length; i++) {
            var rnumb = frontcards[i];
            var newtxt = useSpecWindow.write_card(rnumb, nline_no);
            line_filler.push(newtxt);
            nline_no++;
        }
    }

    function clickedOnForecast(info, citymap) {
        info.misc.special_action = utilities.SA_FORECAST;
        top_offset = boardLocations.TEXT_WINDOW_TOP + HEADER_LINES * boardLocations.CARD_SPACING;
        useSpecWindow.common_stuff(info, citymap);
        var inp_lines = [];
        inp_lines.push('Forecast Card played.');
        inp_lines.push('Use the + and - keys to');
        inp_lines.push('sort the following cards.');
        inp_lines.push('When finished, click DONE.');
        line_filler = useSpecWindow.print_head(inp_lines);
        var i;
        for (i=0; i<FORECAST_SIZE; i++) {
            var ncard = info.card_decks.infections.shift();
            frontcards.push(ncard);
        }
        var vloc = top_offset + boardLocations.CARD_SPACING;
        for (i=0; i<FORECAST_SIZE-1; i++) {
            line_filler.push({"font": drawBoard.MEDIUM_FONT, "text": "+", "color": 'black', "highlight": false, "left": info.display.card_start-PLUS_OFFSET, "top": vloc});
            vloc += boardLocations.CARD_SPACING;
        }
        vloc = top_offset;
        for (i=0; i<FORECAST_SIZE-1; i++) {
            line_filler.push({"font": drawBoard.MEDIUM_FONT, "text": "-", "color": 'black', "highlight": false, "left": info.display.card_start+boardLocations.CARD_WIDTH+MINUS_OFFSET, "top": vloc});
            vloc += boardLocations.CARD_SPACING;
        }
        setCards();
        info.display.special_text_fields = line_filler;
        info.display.special_text_buttons = [done_button];
        info.display.special_callback = useSpecWindow.FORECAST_CALLBACK;
    }

    function forecast_callback(x, y, info) {
        plus_x_loc = info.display.card_start-PLUS_OFFSET;
        minus_x_loc = info.display.card_start+boardLocations.CARD_WIDTH+MINUS_OFFSET;
        top_offset = boardLocations.TEXT_WINDOW_TOP + HEADER_LINES * boardLocations.CARD_SPACING;
        var on_sorter = 0;
        var tst_x = x - plus_x_loc;
        if (tst_x>=0  && tst_x<PLUSMINUS_LEN) {
            on_sorter = 1;
        }
        tst_x = x - minus_x_loc;
        if (tst_x>=0  && tst_x<PLUSMINUS_LEN) {
            on_sorter = -1;
        }
        if (on_sorter !== 0) {
            var hoff =  boardLocations.CARD_SPACING / 2;
            var sloc = top_offset - hoff;
            var yval = y - sloc;
            if ((yval % boardLocations.CARD_SPACING) < hoff) {
                var yoff = Math.floor(yval / boardLocations.CARD_SPACING);
                if (yoff < 0) {
                    return;
                }
                if (on_sorter === 1 && yoff === 0) {
                    return;
                }
                if (yoff >= FORECAST_SIZE) {
                    return;
                }
                if (on_sorter == -1 && yoff == FORECAST_SIZE-1) {
                    return;
                }
                var switchee = yoff - on_sorter;
                var tmp = frontcards[yoff];
                frontcards[yoff] = frontcards[switchee];
                frontcards[switchee] = tmp;
                for (var iii=0; iii<frontcards.length; iii++) {
                    line_filler.pop();
                }
                setCards();
                info.display.special_text_fields = line_filler;
                handleInput.update_page(info);
            }
        }
        if (hit_button(x, y, info) >= 0) {
            for (var i=FORECAST_SIZE-1; i >=0; i--) {
                info.card_decks.infections.unshift(frontcards[i]);
            }
            info.misc.special_action = 0;
            useSpecWindow.clean_up(info);
            frontcards = [];
        }
    }

    function dnumb(cnumb) {
        var icount = 0;
        for (var i=0; i<utilities.NO_OF_GERM_TYPES; i++) {
            var gname = utilities.get_color_name(i);
            var inf = saved_info.diseases[gname].infections;
            var ovals = Object.keys(inf);
            for (var j=0; j<ovals.length; j++) {
                var tkey = ovals[j];
                if (tkey == cnumb.toString()) {
                    var gcount = inf[tkey];
                    icount += gcount*gcount;
                }
            }
        }
        return icount;
    }

    function danger_val(city) {
        var ncity = saved_citymap.bynumb[city];
        var cdata = saved_citymap.byname[ncity];
        var retval = dnumb(city) * 1000;
        for (var ndix=0; ndix<cdata.neighbors.length; ndix++) {
            var nname = cdata.neighbors[ndix];
            var nindx = saved_citymap.byname[nname];
            retval += dnumb(nindx.number);
        }
        return retval;
    }

    function comp_inf(a, b) {
        if (danger_val(a) < danger_val(b))
            return 1;
        if (danger_val(a) > danger_val(b))
            return -1;
        return 0;
    }

    function setup_page(info) {
        var inp_lines = [];
        inp_lines.push('Resillient Population Card played.');
        inp_lines.push('Click on card to be removed.');
        line_filler = useSpecWindow.print_head(inp_lines);
        var sind = page_no * CITY_PER_PAGE;
        var cmax = sind + CITY_PER_PAGE;
        if (cmax > inf_cards.length) {
            cmax = inf_cards.length;
        }
        var nline_no = HDR_RES_LINES;
        for (var i=sind; i<cmax; i++) {
            var newtxt = useSpecWindow.write_card(inf_cards[i], nline_no);
            line_filler.push(newtxt);
            nline_no += 1;
        }
        info.display.special_text_buttons = [];
        if (page_no > 0) {
             info.display.special_text_buttons.push(prev_button);
        }
        if (inf_cards.length > (page_no + 1) * CITY_PER_PAGE) {
             info.display.special_text_buttons.push(next_button);
        }
    }

    function clickedOnResPop(info, citymap) {
        if (info.card_decks.inf_disc.length === 0) {
            info.display.special_text_buttons = [];
            useSpecWindow.print_message(info, citymap, ["There are no cards in the discard pile."]);
            setup_page(info);
            return;
        }
        saved_info = info;
        saved_citymap = citymap;
        info.misc.special_action = utilities.SA_RES_POP;
        useSpecWindow.common_stuff(info, citymap);
        var inp_lines = [];
        inf_cards = [];
        for (var i=0; i<info.card_decks.inf_disc.length; i++) {
            inf_cards.push(info.card_decks.inf_disc[i]);
        }
        inf_cards.sort(comp_inf);
        page_no = 0;
        setup_page(info);
        info.display.special_text_fields = line_filler;
        info.display.special_callback = useSpecWindow.RES_POP_CALLBACK;
    }

    function res_pop_callback(x, y, info) {
        if (hit_button(x, y, info) >= 0) {
            if (x > dbutton_x) {
                page_no++;
            }
            else {
                page_no--;
            }
            setup_page(info);
            info.display.special_text_fields = line_filler;
            handleInput.update_page(info);
            return;
        }
        var sz = inf_cards.length - page_no * CITY_PER_PAGE;
        if (sz > CITY_PER_PAGE) {
            sz = CITY_PER_PAGE;
        }
        var indx = useSpecWindow.gen_callback(x, y, sz, HDR_RES_LINES);
        if (indx < 0) {
            return;
        }
        if (indx >= sz) {
            return;
        }
        var findthis = inf_cards[page_no*CITY_PER_PAGE + indx];
        for (var i=0; i<info.card_decks.inf_disc.length; i++) {
            if (info.card_decks.inf_disc[i] == findthis) {
                info.card_decks.inf_disc.splice(i,1);
                handleInput.update_page(info);
                break;
            }
        }
        info.misc.special_action = 0;
        useSpecWindow.clean_up(info);
    }

    return {
        clickedOnForecast:clickedOnForecast,
        forecast_callback:forecast_callback,
        clickedOnResPop:clickedOnResPop,
        res_pop_callback:res_pop_callback
    };
}();
