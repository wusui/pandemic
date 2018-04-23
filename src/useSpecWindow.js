/* globals boardLocations, utilities, drawBoard, handleInput, clickButton */
/* exported useSpecWindow */
var useSpecWindow = function() {

    var ctx;
    var left_pt = boardLocations.TEXT_WINDOW_LEFT;
    var top_pt = boardLocations.TEXT_WINDOW_TOP;
    var midpoint;
    var y_line_count;
    var lcitymap;

    var RES_STA_CALLBACK = "RES_STA_CALLBACK";
    var HEAL_CALLBACK = "HEAL_CALLBACK";
    var EXTRA_CURE_CALLBACK = "EXTRA_CURE_CALLBACK";
    var MESSAGE_CALLBACK = "MESSAGE_CALLBACK";
    var branch_table = {
        RES_STA_CALLBACK: res_callback,
        HEAL_CALLBACK: heal_callback,
        EXTRA_CURE_CALLBACK: cure_callback,
        MESSAGE_CALLBACK: message_callback
    };

    function do_callback(x, y, info) {
        branch_table[info.display.special_callback](x,y,info);
    }

    function common_stuff(info, citymap) {
        lcitymap = citymap;
        midpoint = left_pt + Math.floor(boardLocations.TEXT_WINDOW_WIDTH / 2);
        y_line_count = 0;
        info.display.card_start = midpoint - boardLocations.CARD_WIDTH / 2;
        info.misc.use_special_window = 1;
        ctx = drawBoard.get_ctx();
    }

    function setup_line(text, lineno) {
        var txt_sline = {};
        txt_sline.font = drawBoard.MEDIUM_FONT;
        txt_sline.text = text;
        var sz = ctx.measureText(text).width;
        var bckoff = Math.floor(sz / 2);
        txt_sline.left = midpoint - bckoff;
        txt_sline.top = top_pt + boardLocations.CARD_SPACING*lineno;
        return txt_sline;
    }

    function clean_up(info) {
        info.misc.use_special_window = 0;
        info.display.special_callback = "";
        info.display.special_text_fields = [];
        handleInput.update_page(info);
    }

    function write_a_line(text, lineno) {
        var txt_line = setup_line(text, lineno);
        txt_line.color = '#000000';
        return txt_line;
    }

    function write_gen_line(value, color, lineno) {
        var txt_line = setup_line(value, lineno);
        txt_line.highlight = true;
        txt_line.color = color;
        return txt_line;
    }

    function write_card(incard, lineno) {
        var cittext = lcitymap.bynumb[incard];
        var txt_line = setup_line(cittext, lineno);
        txt_line.highlight = true;
        var cindex = Math.floor(incard/utilities.CITIES_PER_DISEASE);
        txt_line.color = utilities.get_card_color(cindex);
        return txt_line;
    }

    function print_message(info, citymap, inp_lines) {
        common_stuff(info, citymap);
        inp_lines.push(' ');
        inp_lines.push('Click inside this box');
        inp_lines.push('to unlock and continue.');
        var line_filler = print_head(inp_lines);
        info.display.special_text_fields = line_filler;
        info.display.special_callback = MESSAGE_CALLBACK;
    }

    function print_head(inp_lines) {
        var line_filler = [];
        for (var i=0; i<inp_lines.length; i++) {
            var newtxt = write_a_line(inp_lines[i], i+1);
            line_filler.push(newtxt);
        }
        return line_filler;
    }

    function gen_callback(x, y, numbr, offset) {
        var lcard_start = midpoint - boardLocations.CARD_WIDTH / 2;
        if (x < lcard_start || x > (lcard_start + boardLocations.CARD_WIDTH)) {
            return -1;
        }
        var ctop = boardLocations.TEXT_WINDOW_TOP - boardLocations.MARGIN;
        var loc = y - ctop;
        if (loc % boardLocations.DIS_Y_SPACES > boardLocations.CARD_OFFSET) {
            return -1;
        }
        loc -= offset * boardLocations.CARD_SPACING;
        var indx = Math.floor(loc / boardLocations.DIS_Y_SPACES);
        if (indx > numbr) {
            return -1;
        }
        return indx;
    }

    function heal_callback(x, y, info) {
        var indx = gen_callback(x, y, info.display.special_germs.length, 4);
        if (indx < 0) {
            return;
        }
        var cval = info.display.special_germs[indx];
        clickButton.do_heal(info, cval);
        info.players.moves_left--;
        clean_up(info);
    }

    function res_callback(x, y, info) {
        var indx = gen_callback(x, y, 6, 4);
        if (indx < 0) {
            return;
        }
        info.misc.research_stations.splice(indx,1);
        clean_up(info);
    }

    function cure_callback(x, y, info) {
        var ccards = info.display.cure_cards;
        var needed = info.display.cure_c_needed;
        var indx = gen_callback(x, y, ccards.length, 4);
        if (indx < 0) {
            return;
        }
        ccards.splice(indx,1);
        info.display.cure_cards = ccards;
        if (ccards.length > needed) {
            info.display.cure_cards = ccards;
            info.display.cure_c_needed = needed;
            tooManyCureCards(info, lcitymap);
            handleInput.update_page(info);
        }
        else {
            clickButton.do_cure(info, ccards);
            info.players.moves_left--;
            clean_up(info);
        }
    }

    function message_callback(x, y, info) {
        clean_up(info);
    }

    function tooManyGerms(info, citymap, dvals) {
        common_stuff(info, citymap);
        var line_filler = print_head(["Click on the disease", "that you want to heal"]);
        var nline_no = 4;
        info.display.special_germs = [];
        for (var i=0; i<utilities.NO_OF_GERM_TYPES; i++) {
            if (dvals[i] > 0) {
                var dname = utilities.get_color_name(i);
                var lcolor = utilities.get_card_color(i);
                info.display.special_germs.push(dname);
                var newtxt = write_gen_line(dname, lcolor, nline_no);
                line_filler.push(newtxt);
                nline_no++;
            }
        }
        info.display.special_text_fields = line_filler;
        info.display.special_callback = HEAL_CALLBACK;
    }

    function tooManyStations(info, citymap) {
        common_stuff(info, citymap);
        var line_filler = print_head(["Research Station Limit Exceeded", "Click on station below to remove"]);
        var nline_no = 4;
        for (var i=0; i<info.misc.research_stations.length; i++) {
            var rnumb = info.misc.research_stations[i];
            var newtxt = write_card(rnumb, nline_no);
            line_filler.push(newtxt);
            nline_no++;
        }
        info.display.special_text_fields = line_filler;
        info.display.special_callback = RES_STA_CALLBACK;
    }

    function tooManyCureCards(info, citymap) {
        var ccards = info.display.cure_cards;
        var needed = info.display.cure_c_needed;
        common_stuff(info, citymap);
        var extras = ccards.length - needed;
        var headr1 = "You have " + utilities.num_to_text(extras)  + " extra cure card";
        if (extras > 1) {
            headr1 = headr1 + "s";
        }
        var line_filler = print_head([headr1, "Click on card to keep."]);
        var nline_no = 4;
        for (var i=0; i<ccards.length; i++) {
            var rnumb = ccards[i];
            var newtxt = write_card(rnumb, nline_no);
            line_filler.push(newtxt);
            nline_no++;
        }
        info.display.special_text_fields = line_filler;
        info.display.special_callback = EXTRA_CURE_CALLBACK;
    }

    return {
        do_callback: do_callback,
        print_message:print_message,
        tooManyCureCards:tooManyCureCards,
        tooManyStations:tooManyStations,
        tooManyGerms:tooManyGerms
    };
}();
