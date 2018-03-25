/* globals boardLocations, utilities, drawBoard, handleInput, clickButton */
/* exported useSpecWindow */
var useSpecWindow = function() {

    var ctx;
    var left_pt = boardLocations.TEXT_WINDOW_LEFT;
    var top_pt = boardLocations.TEXT_WINDOW_TOP;
    var midpoint;
    var y_line_count;
    var lcitymap;

    function common_stuff(info, citymap) {
        lcitymap = citymap;
        midpoint = left_pt + Math.floor(boardLocations.TEXT_WINDOW_WIDTH / 2);
        y_line_count = 0;
        info.card_start = midpoint - boardLocations.CARD_WIDTH / 2;
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
        txt_sline.top = top_pt + 20*lineno;
        return txt_sline;
    }

    function clean_up(info) {
        info.misc.use_special_window = 0;
        info.special_callback = "";
        info.special_text_fields = [];
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
        if (loc % boardLocations.DIS_Y_SPACES > 12) {
            return -1;
        }
        loc -= offset * 20;
        var indx = Math.floor(loc / boardLocations.DIS_Y_SPACES);
        if (indx > numbr) {
            return -1;
        }
        return indx;
    }

    function heal_callback(x, y, info) {
        var indx = gen_callback(x, y, info.special_germs.length, 4);
        if (indx < 0) {
            return;
        }
        var cval = info.special_germs[indx];
        clickButton.do_cure(info, cval);
        info.players.moves_left--;
        clean_up(info);
    }

    function res_callback(x, y, info) {
        var indx = gen_callback(x, y, 6, 4);
        if (indx < 0) {
            return;
        }
        info.misc.research_stations.splice(indx,1);
        info.players.moves_left--;
        clean_up(info);
    }

    function tooManyGerms(info, citymap, dvals) {
        common_stuff(info, citymap);
        var line_filler = print_head(["Click on the disease", "that you want to heal"]);
        var nline_no = 4;
        info.special_germs = [];
        for (var i=0; i<utilities.NO_OF_GERM_TYPES; i++) {
            if (dvals[i] > 0) {
                var dname = utilities.get_color_name(i);
                var lcolor = utilities.get_card_color(i);
                info.special_germs.push(dname);
                var newtxt = write_gen_line(dname, lcolor, nline_no);
                line_filler.push(newtxt);
                nline_no++;
            }
        }
        info.special_text_fields = line_filler;
        info.special_callback = "HEAL_CALLBACK";
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
        info.special_text_fields = line_filler;
        info.special_callback = "RES_STA_CALLBACK";
    }

    return {
        res_callback:res_callback,
        heal_callback:heal_callback,
        tooManyStations:tooManyStations,
        tooManyGerms:tooManyGerms
    };
}();
