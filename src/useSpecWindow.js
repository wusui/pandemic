var useSpecWindow = function() {

    var ctx
    var left_pt = boardLocations.TEXT_WINDOW_LEFT
    var top_pt = boardLocations.TEXT_WINDOW_TOP
    var right_pt = left_pt + boardLocations.TEXT_WINDOW_WIDTH
    var bot_pt = top_pt + boardLocations.TEXT_WINDOW_HEIGHT
    var midpoint
    var y_line_count
    var lcitymap

    function common_stuff(info, citymap) {
        lcitymap = citymap
        midpoint = left_pt + Math.floor(boardLocations.TEXT_WINDOW_WIDTH / 2)
        y_line_count = 0
        info.card_start = midpoint - boardLocations.CARD_WIDTH / 2
        info.misc.use_special_window = 1
        ctx = drawBoard.get_ctx()
    }

    function setup_line(text, lineno) {
        var txt_sline = {}
        txt_sline['font'] = drawBoard.MEDIUM_FONT
        txt_sline['text'] = text
        var sz = ctx.measureText(text).width
        var bckoff = Math.floor(sz / 2)
        txt_sline['left'] = midpoint - bckoff
        txt_sline['top'] = top_pt + 20*lineno
        return txt_sline
    }
    function write_a_line(text, lineno) {
        var txt_line = setup_line(text, lineno) 
        txt_line['color'] = '#000000'
        return txt_line
    }

    function write_card(incard,lineno) {
        cittext = lcitymap.bynumb[incard]
        var txt_line = setup_line(cittext, lineno) 
        txt_line['iscard'] = true
        var cindex = Math.floor(incard/utilities.CITIES_PER_DISEASE)
        txt_line['color'] = utilities.get_card_color(cindex)
        return txt_line
    }

    function res_callback(x, y, info) {
        var lcard_start = midpoint - boardLocations.CARD_WIDTH / 2
        if (x < lcard_start || x > (lcard_start + boardLocations.CARD_WIDTH)) {
            return
        }
        var ctop = boardLocations.TEXT_WINDOW_TOP - boardLocations.MARGIN
        var loc = y - ctop
        if (loc % boardLocations.DIS_Y_SPACES > 12) {
            return
        }
        loc -= 80
        var indx = Math.floor(loc / boardLocations.DIS_Y_SPACES)
        if (indx > 6) {
            return
        }
        info.misc.research_stations.splice(indx,1)
        info.misc.use_special_window = 0
        info.special_callback = ""
        info.special_text_fields = []
        handleInput.update_page(info)
    }

    function tooManyStations(info, citymap) {
        common_stuff(info, citymap)
        var line_filler = []
        var newtxt = write_a_line("Research Station Limit Exceeded",1)
        line_filler.push(newtxt)
        newtxt = write_a_line("Click on station below to remove",2)
        line_filler.push(newtxt)
        var nline_no = 4
        for (var i=0; i<info.misc.research_stations.length; i++) {
            var rnumb = info.misc.research_stations[i]
            newtxt = write_card(rnumb, nline_no)
            line_filler.push(newtxt)
            nline_no++
        }
        info.special_text_fields = line_filler
        info.special_callback = "RES_STA_CALLBACK"
    }

    return {
        res_callback:res_callback,
        tooManyStations:tooManyStations
    }
}()
