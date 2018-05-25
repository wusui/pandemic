/* globals $ */
/* exported utilities */
var utilities = function() {

    var filename;
    var exec_func;
    var xcard_color = ['#0000ff', '#000000', '#c08000', '#ff0000', '#00ff00'];
    var color_name = ['BLUE', 'BLACK', 'YELLOW', 'RED'];
    var occupations = {'M': "MEDIC", 'R': "RESEARCHER", 'S': "SCIENTIST",
                       'D': "DISPATCHER", 'O': "OPERATIONS EXP.",
                       'Q': "QUARANTINER", 'C': "CONT. PLANNER"};
    var special_cards = ['Quiet Night', 'Airlift', 'Gov. Grant',
                         'Forecast', 'Resillient Pop.'];
    var num_text_val = ['zero', 'one', 'two', 'three'];

    var BOARD_WIDTH = 11;
    var CITIES_PER_DISEASE = 12;
    var MAX_GERMS = 3;
    var NO_OF_GERM_TYPES = 4;
    var PLAYER_TURNS = 4;
    var EVENT_CARD_TYPE = 4;
    var NO_CARDS_TO_CURE = 5;
    var R_STA_MAX = 6;
    var MAX_GERMS_TOTAL = 24;
    var MAX_OUTBREAKS = 7;
    var MAX_INF_CITIES = NO_OF_GERM_TYPES * CITIES_PER_DISEASE;
    var FIRST_SPECIAL_CARD = 50;
    var BEYOND_LAST_SPECIAL_CARD = FIRST_SPECIAL_CARD + special_cards.length;
    var EPIDEMIC = 60;
    var SA_AIRLIFT_PLAYER = 1;
    var SA_AIRLIFT_LOCATION = 2;
    var SA_GOV_GRANT = 3;
    var SA_FORECAST = 4;
    var SA_RES_POP = 5;

    function cread(callback) {
        $.ajax({
            type: "GET",
            url: filename,
            success: callback
        });
    }

    function readr(filen, pfunc) {
        filename = filen;
        exec_func = pfunc;
        cread(function(resp) {
            exec_func(resp);
        });
    }

    function shuffle(deck)  {
        for (var i = deck.length - 1; i > 0; i -= 1) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
    }

    function num_to_text(val) {
        return num_text_val[val];
    }

    function get_color_name(val) {
        return color_name[val];
    }

    function get_card_color(cval) {
        return xcard_color[cval];
    }

    function card_to_color(card) {
        var  indx = Math.floor(card / CITIES_PER_DISEASE);
        return get_color_name(indx);
    }

    function occupation_name(abbrev) {
        return occupations[abbrev];
    }

    function id_special_card(numb) {
        var ider = numb;
        if (numb >= FIRST_SPECIAL_CARD) {
            ider = ider - FIRST_SPECIAL_CARD;
        }
        return special_cards[ider];
    }

    return {
        readr:readr,
        shuffle:shuffle,
        num_to_text:num_to_text,
        get_color_name:get_color_name,
        get_card_color:get_card_color,
        occupation_name:occupation_name,
        id_special_card:id_special_card,
        card_to_color:card_to_color,
        BOARD_WIDTH:BOARD_WIDTH,
        CITIES_PER_DISEASE:CITIES_PER_DISEASE,
        MAX_GERMS:MAX_GERMS,
        NO_OF_GERM_TYPES:NO_OF_GERM_TYPES,
        PLAYER_TURNS:PLAYER_TURNS,
        MAX_GERMS_TOTAL:MAX_GERMS_TOTAL,
        R_STA_MAX:R_STA_MAX,
        MAX_INF_CITIES:MAX_INF_CITIES,
        MAX_OUTBREAKS:MAX_OUTBREAKS,
        FIRST_SPECIAL_CARD:FIRST_SPECIAL_CARD,
        BEYOND_LAST_SPECIAL_CARD:BEYOND_LAST_SPECIAL_CARD,
        EPIDEMIC:EPIDEMIC,
        EVENT_CARD_TYPE:EVENT_CARD_TYPE,
        NO_CARDS_TO_CURE:NO_CARDS_TO_CURE,
        SA_AIRLIFT_PLAYER:SA_AIRLIFT_PLAYER,
        SA_AIRLIFT_LOCATION:SA_AIRLIFT_LOCATION,
        SA_GOV_GRANT:SA_GOV_GRANT,
        SA_FORECAST:SA_FORECAST,
        SA_RES_POP:SA_RES_POP
    };
}();
