/* exported boardLocations */
var boardLocations = function() {

    var MARGIN = 10;
    var MAP_WIDTH = 990;
    var MAP_HEIGHT = 450;
    var SQ_SIZE = 90;
    var OFFSET_TO_CENTER = SQ_SIZE/2 + MARGIN;
    var WRAP_SIZE = MAP_WIDTH - SQ_SIZE;
    var CITY_SIZE = 40;
    var PLAYER_OFFSET = 36;
    var TEXT_ADJUSTMENT1 = 2;
    var DISEASE_SIZE = 5;
    var CARD_SPACING = 20;
    var PLAYER_AREA_XSIZE = 900;
    var PLAYER_Y_COORD = 480;
    var dis_locs = [-16, -7, 2, 11];
    var WIDTH_RIGHT_PART = 300;
    var RIGHT_PART_START = 1000;
    var DIS_Y_START = 170;
    var DIS_X_START = 1090;
    var DIS_Y_SPACES = 20;
    var BUTTON_X_LEN = 52;
    var BUTTON_Y_HGT = 14;
    var BUTTON_YDIFF = 12;
    var CONTINGENCY_CARD_X = 20;
    var CONTINGENCY_CARD_Y = 690;
    var MOUSE_OFFSET = 18;
    var CARD_WIDTH = 120;
    var PNAME_WIDTH = 160;
    var CARD_HEIGHT = 15;
    var CARD_OFFSET = 12;
    var EDGE_OF_NAMES = 475;
    var MINIMUM_GAP = 5;
    var TEXT_WINDOW_LEFT = RIGHT_PART_START + MINIMUM_GAP;
    var TEXT_WINDOW_WIDTH = WIDTH_RIGHT_PART - 2 * MINIMUM_GAP;
    var TEXT_WINDOW_TOP = 420;
    var TEXT_WINDOW_HEIGHT = 270;
    var BUTTONS = {'Reset': [1052, 43, 1058], 'Help': [1122, 43, 1133],
                   'Quit': [1192, 43, 1203], 'Build': [1016, 78, 1024],
                   'Heal': [1083, 78, 1094], 'Cure': [1152, 78, 1162],
                   'Skip': [1223, 78, 1234]};

    function conv_to_map(loc) {
        return loc * SQ_SIZE + OFFSET_TO_CENTER;
    }

    function get_dis_locs(loc) {
        return dis_locs[loc];
    }

    return {
        conv_to_map:conv_to_map,
        get_dis_locs:get_dis_locs,
        MARGIN:MARGIN,
        MAP_WIDTH:MAP_WIDTH,
        MAP_HEIGHT:MAP_HEIGHT,
        WRAP_SIZE:WRAP_SIZE,
        OFFSET_TO_CENTER:OFFSET_TO_CENTER,
        CITY_SIZE:CITY_SIZE,
        PLAYER_OFFSET:PLAYER_OFFSET,
        TEXT_ADJUSTMENT1:TEXT_ADJUSTMENT1,
        DISEASE_SIZE:DISEASE_SIZE,
        CARD_SPACING:CARD_SPACING,
        PLAYER_AREA_XSIZE:PLAYER_AREA_XSIZE,
        PLAYER_Y_COORD:PLAYER_Y_COORD,
        WIDTH_RIGHT_PART:WIDTH_RIGHT_PART,
	RIGHT_PART_START:RIGHT_PART_START,
        DIS_Y_START:DIS_Y_START,
        DIS_X_START:DIS_X_START,
        DIS_Y_SPACES:DIS_Y_SPACES,
        BUTTON_X_LEN:BUTTON_X_LEN,
        BUTTON_Y_HGT:BUTTON_Y_HGT,
        BUTTON_YDIFF:BUTTON_YDIFF,
        BUTTONS:BUTTONS,
        CONTINGENCY_CARD_X:CONTINGENCY_CARD_X,
        CONTINGENCY_CARD_Y:CONTINGENCY_CARD_Y,
        MOUSE_OFFSET:MOUSE_OFFSET,
        SQ_SIZE:SQ_SIZE,
        CARD_WIDTH:CARD_WIDTH,
        PNAME_WIDTH:PNAME_WIDTH,
        CARD_HEIGHT:CARD_HEIGHT,
        CARD_OFFSET:CARD_OFFSET,
        EDGE_OF_NAMES:EDGE_OF_NAMES,
        TEXT_WINDOW_LEFT:TEXT_WINDOW_LEFT,
        TEXT_WINDOW_WIDTH:TEXT_WINDOW_WIDTH,
        TEXT_WINDOW_TOP:TEXT_WINDOW_TOP,
        TEXT_WINDOW_HEIGHT:TEXT_WINDOW_HEIGHT
    };
}();
