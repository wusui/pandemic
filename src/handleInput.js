var handleInput = function() {

    function update_page(info) {
        var results = JSON.stringify(info)
        sessionStorage.setItem('game_data', results)
        drawBoard.drawBoard()
    }

    function change_checkbox(parm, info) {
        var thischar = drawBoard.chk_abbrevs[parm]
        if (info.misc.game_modes.indexOf(thischar) >= 0) {
            info.misc.game_modes = info.misc.game_modes.replace(thischar,"")
        }
        else {
            info.misc.game_modes += thischar
        }
        update_page(info)
    }

    function mouseSwitch(evt) {
        var x = evt.clientX
        var y = evt.clientY
        var info = JSON.parse(sessionStorage.getItem('game_data'))
        var citymap = JSON.parse(sessionStorage.getItem('citymap'))
        x = x - boardLocations.MOUSE_OFFSET
        y = y - boardLocations.MOUSE_OFFSET
        if (x < boardLocations.MAP_WIDTH) {
            if (y < boardLocations.MAP_HEIGHT) {
                var xoff = Math.floor(x / boardLocations.SQ_SIZE)
                var yoff = Math.floor(y / boardLocations.SQ_SIZE)
                var xinsq = x % boardLocations.SQ_SIZE
                var yinsq = y % boardLocations.SQ_SIZE
                var lb = boardLocations.SQ_SIZE - boardLocations.CITY_SIZE
                lb /= 2
                var ub = lb + boardLocations.CITY_SIZE
                if (xinsq < lb || yinsq < lb || xinsq > ub || yinsq > ub) {
                    return
                }
                var sqind = yoff * utilities.BOARD_WIDTH + xoff
                if (Object.keys(citymap.bycoord).includes(sqind.toString())) {
                    clickCity.clickCity(citymap.bycoord[sqind.toString()], info, citymap)
                }
            }
            else {
                var lxcoord = -1
                var spacing = boardLocations.PLAYER_AREA_XSIZE / info.players.plist.length
                var txtsize = boardLocations.CARD_WIDTH
                if (y < boardLocations.EDGE_OF_NAMES) {
                    txtsize = boardLocations.PNAME_WIDTH
                }
                var indent = Math.floor((spacing - txtsize) / 2)
                for (var ncount=0; ncount<info.players.plist.length; ncount++) {
                    var xover = ncount * spacing + indent + boardLocations.CITY_SIZE
                    if (x > xover & x < xover+txtsize) {
                        lxcoord = ncount
                        break
                    }
                }
                if (lxcoord < 0) {
                    return
                }
                if (y < boardLocations.EDGE_OF_NAMES) {
                    alert(info.players.plist[lxcoord].name+":"+lxcoord.toString())
                    return
                }
                if (y < boardLocations.PLAYER_Y_COORD) {
                    return
                }
                var yindx = y - boardLocations.PLAYER_Y_COORD
                if ((yindx % 20) > 12) {
                    return
                }
                var cindx = Math.floor(yindx / 20)
                if (cindx >= info.players.plist[lxcoord].cards.length) {
                    return
                }
                var deck = info.players.plist[lxcoord].cards.sort(function(a,b){return a-b})
                clickCard.clickCard(deck[cindx], info, citymap)
            }
        }
        else {
            var chckbx_x = boardLocations.CHECKBOX_OFFSET - boardLocations.CHECKBOX_SIZE
            var chckbx_xend = boardLocations.CHECKBOX_OFFSET
            if (x >= chckbx_x && x <= chckbx_xend) {
                var chckbx_y = boardLocations.CHECKBOX_Y_START - boardLocations.CHECKBOX_SIZE
                for (var yoff=0; yoff<(boardLocations.CHECKBOX_Y_SPACES*2 + 1); yoff += boardLocations.CHECKBOX_Y_SPACES) {
                    var ytemp = chckbx_y + yoff
                    var ytemp_end = ytemp  + boardLocations.CHECKBOX_SIZE
                    if (y >= ytemp && y <= ytemp_end) {
                        var parm = yoff / boardLocations.CHECKBOX_Y_SPACES
                        change_checkbox(parm, info)
                        return
                    }
                }
            }
            for (var butn in boardLocations.BUTTONS) { 
                var tx = boardLocations.BUTTONS[butn][0] - boardLocations.MARGIN
                var ty = boardLocations.BUTTONS[butn][1] - boardLocations.MARGIN
                var txl = tx + boardLocations.BUTTON_X_LEN
                var tyl = ty + boardLocations.BUTTON_Y_HGT
                if (x >= tx && x <= txl && y >= ty && y <=tyl) {
                    if (moveOps.is_button_useable(butn)) {
                        alert(butn)
                    }
                    return
                }
            }
        }
    }

    return {
        mouseSwitch:mouseSwitch,
        update_page:update_page
    }
}()
