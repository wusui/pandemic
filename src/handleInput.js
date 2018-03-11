var handleInput = function() {

    function mop_up(info) {
        var mloc = -1
        for (var j=0; j < info.players.plist.length; j++) {
            if (info.players.plist[j].name == 'M') {
                mloc = info.players.plist[j].xlocation
                break
            }
        }
        for (var i=0; i < utilities.NO_OF_GERM_TYPES; i++) {
            var colr = utilities.get_color_name(i)
            if (mloc >= 0) {
                if (info.diseases[colr].cured > 0) {
                    if (info.diseases[colr].infections.hasOwnProperty(mloc)) {
                        var count = info.diseases[colr].infections[mloc]
                        delete info.diseases[colr].infections[mloc]
                        info.diseases[colr].count += count
                    }
                }
            }
            if (info.diseases[colr].count == utilities.MAX_GERMS_TOTAL) {
                if (info.diseases[colr].cured > 0) {
                    info.diseases[colr].eradicated = 1
                }
            }
        }
    }

    function update_page(info) {
        mop_up(info)
        var results = JSON.stringify(info)
        sessionStorage.setItem('game_data', results)
        drawBoard.drawBoard()
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
                    clickPlayer.clickPlayer(lxcoord, info, citymap)
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
            for (var butn in boardLocations.BUTTONS) { 
                var tx = boardLocations.BUTTONS[butn][0] - boardLocations.MARGIN
                var ty = boardLocations.BUTTONS[butn][1] - boardLocations.MARGIN
                var txl = tx + boardLocations.BUTTON_X_LEN
                var tyl = ty + boardLocations.BUTTON_Y_HGT
                if (x >= tx && x <= txl && y >= ty && y <=tyl) {
                    if (moveOps.is_button_useable(butn)) {
                        clickButton.clickButton(butn, info, citymap)
                    }
                    return
                }
            }
            x += boardLocations.MARGIN
            y += boardLocations.MARGIN
            var xx = x - boardLocations.TEXT_WINDOW_LEFT
            if (xx > 0 && xx < boardLocations.TEXT_WINDOW_WIDTH) {
                var yy = y - boardLocations.TEXT_WINDOW_TOP
                if (yy > 0 && yy <  boardLocations.TEXT_WINDOW_HEIGHT) {
                    /* In special text window */
                    alert(x.toString()+":"+y.toString())
                }
            }
        }
    }

    return {
        mouseSwitch:mouseSwitch,
        update_page:update_page
    }
}()
