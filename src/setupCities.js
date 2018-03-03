var setupCities = function() {
    var city_by_name = {}
    var city_by_numb = {}
    var city_by_coord = {}
    var cont_function
    var params

    function init_process(resp) {
        var parts = resp.split('+')
        for (var city in parts) {
            var cinfo = parts[city].split(':')
            var iname = cinfo[0].trim()
            var cdata = {'number': parseInt(city), 'name': iname}
            cdata.neighbors = cinfo[1].split(',')
            var coords = cinfo[2].split(',')
            cdata.xcoord = parseInt(coords[0])
            cdata.ycoord = parseInt(coords[1])
            city_by_name[iname] = cdata
            city_by_numb[city] = iname
            city_by_coord[cdata.ycoord*utilities.BOARD_WIDTH + cdata.xcoord] = iname
        }
        cont_function(params)
    }

    function initialize(in_function) {
        sessionStorage.clear()
        var htmlparm = {}
        var query = window.location.search.substring(1).split("?");
        for (var i = 0, max = query.length; i < max; i++)
        {
            if (query[i] === "")
                continue;
            var param = query[i].split("=");
            htmlparm[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
        }
        cont_function = in_function
        params = []
        params.push(htmlparm.plyrs)
        params.push(htmlparm.roles)
        params.push(htmlparm.epid)
        params.push(htmlparm.display)

        utilities.readr("atlas.txt", init_process)
    }

    function callback() {
        setupCities.save_me()
        setupBoard.initialize(params)
        setupBoard.deal()
        drawBoard.init()
    }

    function save_me() {
        mapped_data = {"byname": city_by_name, "bynumb": city_by_numb, "bycoord": city_by_coord}
        rval = JSON.stringify(mapped_data)
        sessionStorage.setItem("citymap", rval)
        return rval
    }

    return {
        initialize:initialize,
        callback:callback,
        save_me:save_me
    }
}()

setupCities.initialize(setupCities.callback)
