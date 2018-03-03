var handleInput = function() {

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
                if (xinsq < lb) {
                    return
                }
                if (yinsq < lb) {
                    return
                }
                if (xinsq > ub) {
                    return
                }
                if (yinsq > ub) {
                    return
                }
                var sqind = yoff * utilities.BOARD_WIDTH + xoff
                if (Object.keys(citymap.bycoord).includes(sqind.toString())) {
                    alert(citymap.bycoord[sqind.toString()])
                }
            }
        }
    }

    return {
        mouseSwitch:mouseSwitch
    }
}()
