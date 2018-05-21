/* globals boardLocations, utilities, drawBoard, handleInput, clickButton, specialSpecial, clickCard, germHandler */
/* exported useSpecWindow */
var useSpecWindow = function() {

    // var ctx;
    var left_pt = boardLocations.TEXT_WINDOW_LEFT;
    var top_pt = boardLocations.TEXT_WINDOW_TOP;
    var midpoint;
    var y_line_count;
    var lcitymap;

    var STD_SPACING = 4;
    var HAND_LIMIT = 7;
    var RES_STA_CALLBACK = "RES_STA_CALLBACK";
    var HEAL_CALLBACK = "HEAL_CALLBACK";
    var EXTRA_CURE_CALLBACK = "EXTRA_CURE_CALLBACK";
    var MESSAGE_CALLBACK = "MESSAGE_CALLBACK";
    var FORECAST_CALLBACK = "FORECAST_CALLBACK";
    var EPIDEMIC_CALLBACK = "EPIDEMIC_CALLBACK";
    var RES_POP_CALLBACK = "RES_POP_CALLBACK";
    var DISCARD_CALLBACK = "DISCARD_CALLBACK";
    var EOT_OUTBRK_CALLBACK = "EOT_OUTBRK_CALLBACK";
    var EXIT_CALLBACK = "EXIT_CALLBACK";
    var BETWEEN_MOVE_CALLBACK = "BETWEEN_MOVE_CALLBACK";
    var branch_table = {
        RES_STA_CALLBACK: res_callback,
        HEAL_CALLBACK: heal_callback,
        EXTRA_CURE_CALLBACK: cure_callback,
        MESSAGE_CALLBACK: message_callback,
        EXIT_CALLBACK: exit_callback,
        FORECAST_CALLBACK: forecast_callback,
        RES_POP_CALLBACK: res_pop_callback,
        DISCARD_CALLBACK: discard_callback,
        EPIDEMIC_CALLBACK: epidemic_callback,
        EOT_OUTBRK_CALLBACK: eot_outbrk_callback,
        BETWEEN_MOVE_CALLBACK: between_move_callback
    };

    function do_callback(x, y, info) {
        branch_table[info.display.special_callback](x,y,info);
    }

    function common_stuff(info, citymap) {
        lcitymap = citymap;
        midpoint = left_pt + Math.floor(boardLocations.TEXT_WINDOW_WIDTH / 2);
        y_line_count = 0;
        info.display.card_start = Math.floor(midpoint - boardLocations.CARD_WIDTH / 2);
        info.misc.use_special_window = 1;
    }

    function setup_line(text, lineno) {
        var txt_sline = {};
        txt_sline.font = drawBoard.MEDIUM_FONT;
        txt_sline.text = text;
        var lctx = drawBoard.get_ctx();
        var sz = lctx.measureText(text).width;
        var bckoff = Math.floor(sz / 2);
        txt_sline.left = midpoint - bckoff;
        txt_sline.top = top_pt + boardLocations.CARD_SPACING*lineno;
        return txt_sline;
    }

    function clean_up(info) {
        info.misc.use_special_window = 0;
        info.display.special_callback = "";
        info.display.special_text_fields = [];
        info.display.special_text_buttons = [];
        handleInput.update_page(info);
    }

    function write_a_line(text, lineno) {
        var txt_line = setup_line(text, lineno);
        txt_line.color = drawBoard.BLACK;
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
        if (incard > utilities.MAX_INF_CITIES) {
            cittext = utilities.id_event_card(incard);
        }
        var txt_line = setup_line(cittext, lineno);
        txt_line.highlight = true;
        var cindex = Math.floor(incard/utilities.CITIES_PER_DISEASE);
        txt_line.color = utilities.get_card_color(cindex);
        return txt_line;
    }

    function epidemic_message(info, citymap, inp_lines) {
        general_message(info, citymap, inp_lines, EPIDEMIC_CALLBACK);
    }

    function exit_message(info, citymap, inp_lines) {
        general_message(info, citymap, inp_lines, EXIT_CALLBACK);
    }

    function print_message(info, citymap, inp_lines) {
        general_message(info, citymap, inp_lines, MESSAGE_CALLBACK);
    }

    function eot_outbrk_message(info, citymap, inp_lines) {
        general_message(info, citymap, inp_lines, EOT_OUTBRK_CALLBACK);
    }

    function special_message(info, citymap, inp_lines) {
        common_stuff(info, citymap);
        info.misc.use_special_window = 0;
        var line_filler = print_head(inp_lines);
        info.display.special_text_fields = line_filler;
    }

    function general_message(info, citymap, inp_lines, callback) {
        common_stuff(info, citymap);
        inp_lines.push(' ');
        inp_lines.push('Click OKAY to unlock and continue.');
        var line_filler = print_head(inp_lines);
        info.display.special_text_buttons = [specialSpecial.OKAY_BUTTON];
        info.display.special_text_fields = line_filler;
        info.display.special_callback = callback;
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
        var indx = gen_callback(x, y, info.display.special_germs.length, STD_SPACING);
        if (indx < 0) {
            return;
        }
        var cval = info.display.special_germs[indx];
        clickButton.do_heal(info, cval);
        info.players.moves_left--;
        clean_up(info);
    }

    function res_callback(x, y, info) {
        var indx = gen_callback(x, y, utilities.R_STA_MAX, STD_SPACING);
        if (indx < 0) {
            return;
        }
        info.misc.research_stations.splice(indx,1);
        clean_up(info);
    }

    function cure_callback(x, y, info) {
        var ccards = info.display.cure_cards;
        var needed = info.display.cure_c_needed;
        var indx = gen_callback(x, y, ccards.length, STD_SPACING);
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

    function discard_callback(x, y, info) {
        var ccards = info.display.too_many_in_hand;
        var indx = gen_callback(x, y, ccards.length, STD_SPACING);
        if (indx < 0) {
            return;
        }
        var cty = ccards.splice(indx,1);
        info.misc.card_played = cty[0];
        info.misc.discarding_special = false;
        if (cty[0] > utilities.MAX_INF_CITIES) {
            info.misc.discarding_special = true;
            info.misc.card_stash = ccards;
            var citymap = JSON.parse(sessionStorage.getItem('citymap'));
            clickCard.specialCard(cty[0], info, citymap);
            return;
        }
        discard_continue(info, ccards);
    }

    function discard_continue(info, ccards) {
        info.misc.discarding_special = false;
        clickCard.discard(info);
        info.display.too_many_in_hand = ccards.slice();
        if (ccards.length > HAND_LIMIT) {
            var citymap = JSON.parse(sessionStorage.getItem('citymap'));
            tooManyCards(info, citymap);
            handleInput.update_page(info);
        }
        else {
            clean_up(info);
            if (info.misc.epid_cnt_for_callback >= 0) {
                handleInput.continue_after_cardcheck(info);
            }
            if (info.misc.card_pass_in_progress) {
                info.misccard_pass_in_progress = false;
                info.players.moves_left--;
                handleInput.update_page(info);
            }
        }
    }

    function eot_outbrk_callback(x, y, info) {
        var indx = specialSpecial.hit_button(x, y, info);
        if (indx < 0) {
            return;
        }
        info.misc.nxt_out.shift();
        clean_up(info);
        handleInput.continue_after_outbreaks(info);
    }

    function between_move_callback(x, y, info) {
        var citymap = JSON.parse(sessionStorage.getItem('citymap'));
        var indx = specialSpecial.hit_button(x, y, info);
        info.misc.special_between_turns = false;
        if (indx == 0) {
            clean_up(info);
            handleInput.continue_after_cardcheck(info);
            return;
        }
        indx = gen_callback(x, y, info.misc.avail_specials, 5);
        if (indx < 0) {
            return;
        }
        if (indx < info.misc.avail_specials.length) {
            info.misc.special_between_turns = true;
            clickCard.specialCard(info.misc.avail_specials[indx], info, citymap);
            return;
        }
        clean_up(info);
        germHandler.epid_continue(info);
    }

    function message_callback(x, y, info) {
        var indx = specialSpecial.hit_button(x, y, info);
        if (indx < 0) {
            return;
        }
        clean_up(info);
        if (info.misc.discarding_special) {
            discard_continue(info, info.misc.card_stash);
        }
        if (info.misc.special_between_turns) {
            germHandler.epid_continue(info);
        }
    }

    function exit_callback(x, y, info) {
        var indx = specialSpecial.hit_button(x, y, info);
        if (indx < 0) {
            return;
        }
        close();
    }

    function epidemic_callback(x, y, info) {
        var indx = specialSpecial.hit_button(x, y, info);
        if (indx < 0) {
            return;
        }
        clean_up(info);
        germHandler.epidemic_callback(info);
    }

    function forecast_callback(x, y, info) {
        specialSpecial.forecast_callback(x, y, info);
    }

    function res_pop_callback(x, y, info) {
        specialSpecial.res_pop_callback(x, y, info);
    }

    function tooManyGerms(info, citymap, dvals) {
        common_stuff(info, citymap);
        var line_filler = print_head(["Click on the disease", "that you want to heal"]);
        var nline_no = STD_SPACING;
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
        var nline_no = STD_SPACING;
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
        var nline_no = STD_SPACING;
        for (var i=0; i<ccards.length; i++) {
            var rnumb = ccards[i];
            var newtxt = write_card(rnumb, nline_no);
            line_filler.push(newtxt);
            nline_no++;
        }
        info.display.special_text_fields = line_filler;
        info.display.special_callback = EXTRA_CURE_CALLBACK;
    }

    function tooManyCards(info, citymap) {
        common_stuff(info, citymap);
        var line_filler = print_head(["Player has too many cards", "Click on card to discard."]);
        var nline_no = STD_SPACING;
        for (var ii=0; ii<info.display.too_many_in_hand.length; ii++) {
            var rnumb = info.display.too_many_in_hand[ii];
            var newtxt = write_card(rnumb, nline_no);
            line_filler.push(newtxt);
            nline_no++;
        }
        info.display.special_text_fields = line_filler;
        info.display.special_callback = DISCARD_CALLBACK;
        handleInput.update_page(info);
    }

    return {
        FORECAST_CALLBACK:FORECAST_CALLBACK,
        RES_POP_CALLBACK:RES_POP_CALLBACK,
        BETWEEN_MOVE_CALLBACK:BETWEEN_MOVE_CALLBACK,
        HAND_LIMIT:HAND_LIMIT,
        do_callback:do_callback,
        gen_callback:gen_callback,
        epidemic_message:epidemic_message,
        eot_outbrk_message:eot_outbrk_message,
        print_message:print_message,
        special_message:special_message,
        exit_message:exit_message,
        tooManyCureCards:tooManyCureCards,
        tooManyStations:tooManyStations,
        tooManyGerms:tooManyGerms,
        tooManyCards:tooManyCards,
        common_stuff:common_stuff,
        print_head:print_head,
        write_card:write_card,
        discard_continue:discard_continue,
        clean_up:clean_up
    };
}();
