/* globals useSpecWindow, boardLocations, utilities, drawBoard, handleInput */
/* exported specialSpecial */
var specialSpecial = function() {

    var FORECAST_SIZE = 6;
    var HEADER_LINES = 6;
    var BUT_TXT_OFF = 6;
    var BUT_LOC_FROM_BOT = 25;
    var BUT_TXT_LOC = 165;
    var PLUS_OFFSET = 10;
    var MINUS_OFFSET = 2;
    var PLUSMINUS_LEN = 10;
    var plus_x_loc;
    var minus_x_loc;
    var top_offset;
    var saved_citymap;
    var line_filler;

    var dbutton_y = boardLocations.TEXT_WINDOW_TOP + boardLocations.TEXT_WINDOW_HEIGHT - BUT_LOC_FROM_BOT;
    var dbutton_x = boardLocations.TEXT_WINDOW_LEFT + boardLocations.TEXT_WINDOW_WIDTH - BUT_TXT_LOC;
    var tloc = dbutton_x + BUT_TXT_OFF;
    var done_button = {"text": "DONE", "locations": [dbutton_x, dbutton_y, tloc]};
    var frontcards = [];

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
        saved_citymap = citymap;
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
                // must redisplay cards here
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

    return {
        clickedOnForecast:clickedOnForecast,
        forecast_callback:forecast_callback
    };
}();
