/* globals $ */
/* exported handleFirstPage */
var handleFirstPage = function() {
    var MSG1 = "<div>The number of roles must be greater than or equal to the number of players.</div>";
    function readradio(element) {
        var radios = document.getElementsByName(element);
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return i;
            }
        }
        return -1;
    }
    function link() {
        var plyrs = readradio('plyrnumb');
        plyrs += 2;
        var epid = readradio('epidnumb');
        epid += 4;
        var oroles = '';
        var roles = document.getElementsByName('role');
        for (var i = 0; i < roles.length; i++) {
            if (roles[i].checked) {
                oroles = oroles.concat(roles[i].value);
            }
        }
        if (oroles.length < plyrs) {
            $(MSG1).dialog(
                {modal: true, height: 140, width: 400, title: 'ERROR'});
            return;
        }
        var gamev = "realgame.html".concat("?plyrs=", plyrs, "?epid=", epid, "?roles=", oroles);
        window.open(gamev);
    }

    return {
        link:link
    };
}();
