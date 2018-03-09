var drawBoard = function() {

    var pcanvas
    var ctx

    var SMALL_FONT = "bold 10px Arial"
    var MEDIUM_FONT = "bold 14px Arial"
    var BIG_FONT = "bold 18px Arial"

    var BLACK = "#000000"
    var WHITE = "#ffffff"
    var BKGRND_GREEN = "#f4fff4"
    var BKGRND_BLUE = "#f4f4ff"
    var GREY = "#c0c0c0"
    var MEDIUM_GREEN = "#c0ffc0" 
    var PURPLE = "#ff00ff"
    var OFF_YELLOW = "#ffffa0"

    var DISP_OPT_HEADER = 50
    var SPEC_BUTTONS_HEAD = 190
    var DISEASES_HEAD = 305
    var OTHER_STATS_HEAD = 440
    var SEPLINE1 = 160
    var SEPLINE2 = 280
    var SEPLINE3 = 415
    var OTHER_STATS_START = 470
    var OTHER_STATS_YDIFF = 20 
    var SEP_X_START = 1015
    var SEP_X_END = 1290
    var START_OTHER = 470
    var SEP_STATS = 20

    var chkstrs = ['Play-by-play Mode', 'Careful Mode', 'Helpful Mode']
    var chk_abbrevs = ['P', 'C', 'H']

    function init() {
        pcanvas = document.getElementById("myMap")
        ctx = pcanvas.getContext("2d")
        pcanvas.addEventListener("click", handleInput.mouseSwitch, false)
        pcanvas.addEventListener("keypress", htmlInterface.debug, false)
        drawBoard()
    }

    function centerRightTxt(contxt, instring, yval) {
        var wval = boardLocations.WIDTH_RIGHT_PART
        var sleng = contxt.measureText(instring).width
        var spos = boardLocations.RIGHT_PART_START
        var loffset = (wval - sleng) / 2
        contxt.fillText(instring, Math.floor(loffset)+spos, yval)
    }

    function draw_sep_line(ctx, yspot) {
        ctx.strokeStyle = BLACK
        ctx.beginPath()
        ctx.moveTo(SEP_X_START, yspot)
        ctx.lineTo(SEP_X_END, yspot)
        ctx.stroke()
    }
    function disp_oth_stats(ctx, otherstats) {
        var yspace = START_OTHER
        for (var i in otherstats) {
            var fstring = otherstats[i].join('')
            var sval = Math.floor(ctx.measureText(fstring).width)
            centerRightTxt(ctx, fstring, yspace) 
            yspace += SEP_STATS
        }
    }

    function drawBoard() {
        var info = JSON.parse(sessionStorage.getItem('game_data'))
        var citymap = JSON.parse(sessionStorage.getItem('citymap'))
        ctx.fillStyle = BKGRND_GREEN
        ctx.fillRect(0, 0, pcanvas.width, pcanvas.height)
        ctx.fillStyle = BKGRND_BLUE
        ctx.rect(boardLocations.MARGIN, boardLocations.MARGIN, boardLocations.MAP_WIDTH, boardLocations.MAP_HEIGHT)
        ctx.fillRect(boardLocations.MARGIN, boardLocations.MARGIN, boardLocations.MAP_WIDTH, boardLocations.MAP_HEIGHT)
        ctx.stroke()
        ctx.strokeStyle = PURPLE
        for (var key in citymap.byname) {
            neighbors = citymap.byname[key].neighbors
            for (tocity in neighbors) {
                var x1 = boardLocations.conv_to_map(citymap.byname[neighbors[tocity]].xcoord)
                var y1 = boardLocations.conv_to_map(citymap.byname[neighbors[tocity]].ycoord)
                var x2 = boardLocations.conv_to_map(citymap.byname[key].xcoord)
                var y2 = boardLocations.conv_to_map(citymap.byname[key].ycoord)
                if (Math.abs(x1-x2) < boardLocations.WRAP_SIZE) {
                    ctx.beginPath()
                    ctx.moveTo(x1, y1)
                    ctx.lineTo(x2, y2)
                    ctx.stroke()
                }
                else {
                    var newy = Math.floor((y1+y2)/2)
                    var smally = y2
                    if (x1 == boardLocations.OFFSET_TO_CENTER) {
                        smally = y1
                    }
                    var bigy = y1 + y2 - smally
                    ctx.beginPath()
                    ctx.moveTo(boardLocations.MARGIN, newy)
                    ctx.lineTo(boardLocations.OFFSET_TO_CENTER,smally)
                    ctx.stroke()
                    ctx.beginPath()
                    ctx.moveTo(boardLocations.WRAP_SIZE+boardLocations.OFFSET_TO_CENTER,bigy)
                    ctx.lineTo(boardLocations.MAP_WIDTH+boardLocations.MARGIN,newy)
                    ctx.stroke()
                }
            }
        }

        for (var key1 in citymap.byname) {
            var xc = boardLocations.conv_to_map(citymap.byname[key1].xcoord) - boardLocations.CITY_SIZE/2
            var yc = boardLocations.conv_to_map(citymap.byname[key1].ycoord) - boardLocations.CITY_SIZE/2
            var cname = citymap.byname[key1].name
            var numb = parseInt(citymap.byname[key1].number)
            ctx.fillStyle = WHITE
            if (info.misc.research_stations.includes(numb)) {
                ctx.fillStyle = MEDIUM_GREEN
            }
            ctx.fillRect(xc, yc, boardLocations.CITY_SIZE, boardLocations.CITY_SIZE)
            var dtype = Math.floor(numb/utilities.CITIES_PER_DISEASE)
            ctx.strokeStyle = utilities.get_card_color(dtype)
            ctx.strokeRect(xc, yc, boardLocations.CITY_SIZE, boardLocations.CITY_SIZE)
            ctx.fillStyle = ctx.strokeStyle
            ctx.font = SMALL_FONT
            ctx.fillText(cname, xc, yc-boardLocations.TEXT_ADJUSTMENT1)
        }

        var cur_locs = {}
        for (var iloc = 0; iloc <  info.players.plist.length; iloc++) {
            var lname = info.players.plist[iloc].name
            var lloc = info.players.plist[iloc].xlocation
            if (lloc in cur_locs) {
                cur_locs[lloc] = cur_locs[lloc] + lname
            }
            else {
                cur_locs[lloc] = lname
            }
        }
        ctx.font = BIG_FONT
        ctx.fillStyle = BLACK
        for (var tkey in Object.keys(cur_locs)) {
            var cnumb = Object.keys(cur_locs)[tkey]
            var ocity = citymap.bynumb[cnumb]
            var xv = parseInt(citymap.byname[ocity].xcoord)
            var yv = parseInt(citymap.byname[ocity].ycoord)
            var otext = cur_locs[cnumb]
            var sval = Math.floor(ctx.measureText(otext).width/2)
            ctx.fillText(otext, boardLocations.conv_to_map(xv)-sval, boardLocations.conv_to_map(yv)+boardLocations.PLAYER_OFFSET)
        }
        for (var dcount=0; dcount<utilities.NO_OF_GERM_TYPES; dcount++) {
            var dname = utilities.get_color_name(dcount)
            ctx.fillStyle = utilities.get_card_color(dcount)
            var inf2add = info.diseases[dname].infections
            for (var icity in Object.keys(inf2add)) {
                var citnm = Object.keys(inf2add)[icity]
                var cityz = citymap.bynumb[citnm]
                var xloc = boardLocations.conv_to_map(parseInt(citymap.byname[cityz].xcoord))
                var yloc = boardLocations.conv_to_map(parseInt(citymap.byname[cityz].ycoord))
                var xoff = boardLocations.get_dis_locs(dcount)
                var cnt = parseInt(info.diseases[dname].infections[citnm])
                for (var gcount=0; gcount<cnt; gcount++) {
                    var yoff = boardLocations.get_dis_locs(utilities.MAX_GERMS-gcount)
                    ctx.fillRect(xloc+xoff, yloc+yoff, boardLocations.DISEASE_SIZE, boardLocations.DISEASE_SIZE)
                }
            }
        }

        ctx.font = BIG_FONT
        var pcount = info.players.plist.length
        var spacing = boardLocations.PLAYER_AREA_XSIZE / pcount
        for (var ncount=0; ncount<pcount; ncount++) {
            var pentry = info.players.plist[ncount]
            var pname = pentry.name
            var occ = utilities.occupation_name(pname)
            var maxn = Math.floor(ctx.measureText(occ).width+1)
            var indent = Math.floor((spacing - maxn) / 2)
            var xover = ncount * spacing + indent + boardLocations.CITY_SIZE
            ctx.fillStyle = GREY
            if (ncount == parseInt(info.players.plyr_move)) {
                ctx.fillStyle = BLACK
            }
            ctx.fillText(occ, xover, boardLocations.PLAYER_Y_COORD)
        }
        ctx.font = MEDIUM_FONT
        for (ncount=0; ncount<pcount; ncount++) {
            pentry = info.players.plist[ncount]
            var deck = pentry.cards.sort(function(a,b){return a-b})
            var vline = boardLocations.PLAYER_Y_COORD
            for (var card in deck) {
                if (deck[card] >= utilities.FIRST_SPECIAL_CARD) {
                    var ctext = utilities.id_event_card(deck[card])
                }
                else {
                    ctext = citymap.bynumb[deck[card]]
                }
                maxn = Math.floor(ctx.measureText(ctext).width+1)
                indent = Math.floor((spacing - maxn) / 2)
                xover = ncount * spacing + indent + boardLocations.CITY_SIZE
                vline += boardLocations.CARD_SPACING
                var nindent = Math.floor((spacing - boardLocations.CARD_WIDTH) / 2)
                var cdsp = ncount * spacing + nindent + boardLocations.CITY_SIZE
                cdsp = Math.floor(cdsp)
                ctx.fillStyle = OFF_YELLOW
                ctx.fillRect(cdsp, vline-boardLocations.CARD_OFFSET, boardLocations.CARD_WIDTH, boardLocations.CARD_HEIGHT)
                cindex = Math.floor(deck[card]/utilities.CITIES_PER_DISEASE)
                ctx.fillStyle = utilities.get_card_color(cindex)
                ctx.fillText(ctext, xover, vline)
            }
        }

        var gm_modes = info.misc.game_modes
        var chk_yloc = boardLocations.CHECKBOX_Y_START
        ctx.fillStyle = BLACK
        centerRightTxt(ctx, 'Display Options', DISP_OPT_HEADER)
        ctx.strokeStyle = BLACK
        for (var checkbx=0; checkbx<chk_abbrevs.length; checkbx++) {
            gm_modes[checkbx] = false
            ctx.fillStyle = WHITE
            if (gm_modes.indexOf(chk_abbrevs[checkbx]) >= 0) {
                ctx.fillStyle = BLACK
                gm_modes[checkbx] = true
            }
            ctx.strokeRect(boardLocations.CHECKBOX_OFFSET, chk_yloc, boardLocations.CHECKBOX_SIZE, boardLocations.CHECKBOX_SIZE)
            ctx.fillRect(boardLocations.CHECKBOX_OFFSET, chk_yloc, boardLocations.CHECKBOX_SIZE, boardLocations.CHECKBOX_SIZE)
            ctx.fillStyle = BLACK
            ctx.fillText(chkstrs[checkbx], boardLocations.CHECKBOX_OFFSET+2*boardLocations.CHECKBOX_SIZE, chk_yloc+boardLocations.CHECKBOX_SIZE)
            chk_yloc += boardLocations.CHECKBOX_Y_SPACES
        }
        draw_sep_line(ctx, SEPLINE1)

        centerRightTxt(ctx, 'Special Buttons', SPEC_BUTTONS_HEAD)
        ctx.fillStyle = BLACK
        ctx.strokeStyle = BLACK
        moveOps.init(info, citymap)
        var bkey
        var but_keys = Object.keys(boardLocations.BUTTONS)
        for (bkey in but_keys) {
            var binfo = but_keys[bkey]
            ctx.strokeRect(boardLocations.BUTTONS[binfo][0], boardLocations.BUTTONS[binfo][1], boardLocations.BUTTON_X_LEN, boardLocations.BUTTON_Y_HGT) 
            if (moveOps.is_button_useable(binfo)) {
                ctx.fillStyle = WHITE
            }
            else {
                ctx.fillStyle = GREY
            }
            ctx.fillRect(boardLocations.BUTTONS[binfo][0], boardLocations.BUTTONS[binfo][1], boardLocations.BUTTON_X_LEN, boardLocations.BUTTON_Y_HGT)
            ctx.fillStyle = BLACK
            ctx.fillText(binfo, boardLocations.BUTTONS[binfo][2], boardLocations.BUTTONS[binfo][1] + boardLocations.BUTTON_YDIFF)
        }
        draw_sep_line(ctx, SEPLINE2)

        centerRightTxt(ctx, 'Diseases', DISEASES_HEAD)
        var dis_y_cnt = boardLocations.DIS_Y_START
        for (var i=0; i<utilities.NO_OF_GERM_TYPES; i++) {
            var colorp = utilities.get_color_name(i)
            var tcol = info.diseases[colorp]
            var dstatus = 'ACTIVE'
            if (tcol.eradicated > 0) {
                dstatus = 'ERADICATED'
            }
            else {
                if (tcol.cured> 0) {
                    dstatus = 'CURED'
                }
            }
            cstr = tcol.count.toString()
            ctx.fillStyle = utilities.get_card_color(i)
            var msg1 = [colorp, dstatus].join('/')
            var msg2 = [msg1, cstr].join(':')
            ctx.fillText(msg2, boardLocations.DIS_X_START, dis_y_cnt)
            dis_y_cnt += boardLocations.DIS_Y_SPACES
        }
        draw_sep_line(ctx, SEPLINE3)

        ctx.fillStyle = BLACK
        centerRightTxt(ctx, 'Other Statistics', OTHER_STATS_HEAD)

        var otherstats = []
        otherstats.push(["Outbreaks: ", info.misc.outbreak_count.toString()])
        var epidindx = info.misc.epid_counter
        var epidrate = info.misc.epid_values[epidindx]
        otherstats.push(["Infection Rate: ", epidrate, '(', epidindx.toString(), ')'])
        otherstats.push(["Cards Left: ",info.card_decks.player_cards.length.toString()])
        var rsl = info.misc.research_stations.length
        var rslcnt = utilities.R_STA_MAX - rsl
        otherstats.push(["Research Stations Left: ", rslcnt.toString()])
        otherstats.push(["Actions Left: ",info.players.moves_left.toString()])
        otherstats.push(["Player #: ",info.players.plyr_move.toString()])
        disp_oth_stats(ctx, otherstats)

        var no_contingency = true
        for (var ii=0; ii < info.players.plist.length; ii++) {
            if (info.players.plist[ii].name == 'C') {
                no_contingency = false
                break
            }
        }
        if (no_contingency) {
            return
        }

        var no_card_avail = true
        for (ii=0; ii<info.card_decks.player_disc.length; ii++) {
            if (info.card_decks.player_disc[ii] >= utilities.FIRST_SPECIAL_CARD) {
                no_card_avail = false
                break
            }
        }
        var cardval = "+"
        if (no_card_avail) {
            ctx.fillStyle = GREY
        }
        else {
            ctx.fillStyle = utilities.get_card_color(utilities.EVENT_CARD_TYPE)
        }
        if (info.misc.contingency_card > 0) {
            cardval = utilities.xcard_color[info.misc.contingency_card - utilities.FIRST_SPECIAL_CARD]
        }
        centerRightTxt(ctx, cardval, boardLocations.CONTINGENCY_CARD_Y)
    }

    return {
        init:init,
        chk_abbrevs:chk_abbrevs,
        drawBoard:drawBoard
    }
}()
