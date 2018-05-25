/* global utilities */
/* exported setupBoard */

var setupBoard = function() {

    var misc_data = {};

    var plyr_list;
    var plyr_move;
    var moves_left;
    var plyr_d = {};

    var dis_data = {};

    var infections = [];

    var MAGIC_CARD_INFO = 6;

    function initialize(params) {
        misc_data.we_won = false;
        misc_data.loseInfo = "";
        misc_data.quiet_night = false;
        misc_data.airlifted_player = -1;
        misc_data.special_action = 0;
        misc_data.research_stations = [0];
        misc_data.outbreak_count = 0;
        misc_data.epid_counter = 0;
        misc_data.epid_values = [2,2,2,3,3,4,4];
        misc_data.game_status = 0;
        misc_data.contingency_card = 0;
        misc_data.op_exp_used_power = 0;
        misc_data.card_played = -1;
        misc_data.dispatched_player = -1;
        misc_data.use_special_window = 0;
        misc_data.card_parm = [];
        misc_data.epid_city = -1;
        misc_data.epid_cnt_for_callback = -1;
        misc_data.nxt_out = [];
        misc_data.no_skip_done_yet = true;
        misc_data.card_pass_in_progress = false;
        misc_data.discarding_special = false;
        misc_data.card_stash = [];
        misc_data.avail_specials = [];
        plyr_move = 0;
        moves_left = utilities.PLAYER_TURNS;
        plyr_list = params[1].split('');
        utilities.shuffle(plyr_list);
        var plist = [];
        for (var i=0; i<params[0]; i++) {
            var npl = {'name': plyr_list[i], 'cards': [], 'xlocation': 0};
            plist.push(npl);
        }

        plyr_d.plist = plist;
        plyr_d.plyr_move = plyr_move;
        plyr_d.moves_left = moves_left;

        for (i=0; i<utilities.NO_OF_GERM_TYPES; i++) {
            dis_data[utilities.get_color_name(i)] = 
                    {'count': utilities.MAX_GERMS_TOTAL, 'infections': {},
                     'inf_type': i, 'cured': 0, 'eradicated': 0};
        }

        var pcards = [];
        var epid_count = params[2];
        for (i=0; i < utilities.MAX_INF_CITIES; i++) {
            infections.push(i);
            pcards.push(i);
        }
        utilities.shuffle(infections);
        for (i=utilities.FIRST_SPECIAL_CARD;
             i < utilities.BEYOND_LAST_SPECIAL_CARD; i++) {
            pcards.push(i);
        }
        utilities.shuffle(pcards);
        var cardspp = MAGIC_CARD_INFO - params[0];
        var totsv = cardspp * params[0];
        var dcards = pcards.splice(0, totsv);
        var pdecks = [];
        for (i=0; i < epid_count; i++) {
            pdecks.push([]);
        }
        for (i=0; i < epid_count; i++) {
            pdecks[i].push(utilities.EPIDEMIC);
        }
        for (i=0; i < pcards.length; i++) {
            var indx = i % epid_count;
            pdecks[indx].push(pcards[i]);
        }
        for (i=0; i < epid_count; i++) {
            utilities.shuffle(pdecks[i]);
        }
        var ndeck = dcards;
        for (i=0; i < epid_count; i++) {
            ndeck = ndeck.concat(pdecks[i]);
        }
        var card_data = {"infections": infections, "inf_disc": [],
                         "player_cards": ndeck, "player_disc": []};

        var l_display = {};
        l_display.card_start = 0;
        l_display.special_callback = "";
        l_display.special_text_fields = [];
        l_display.special_text_buttons = [];
        l_display.special_germs = [];
        l_display.cure_cards = [];
        l_display.cure_c_needed = -1;
        l_display.too_many_in_hand = [];

        var retv = {"misc": misc_data, "players": plyr_d,
                    "diseases": dis_data, "card_decks": card_data,
                    "display": l_display};
        var results = JSON.stringify(retv);
        sessionStorage.setItem('game_data', results);
        return results;
    }

    function deal() {
        var info = JSON.parse(sessionStorage.getItem('game_data'));
        for (var cnt=3; cnt>0; cnt--) {
            for (var numb=0; numb<3; numb++) {
                var city = info.card_decks.infections.shift();
                info.card_decks.inf_disc.push(city);
                var color = Math.floor(city / utilities.CITIES_PER_DISEASE);
                var ckey = utilities.get_color_name(color);
                info.diseases[ckey].count -= cnt;
                info.diseases[ckey].infections[city] = cnt;
            }
        }
        var pcount = info.players.plist.length;
        for (var rnd=0; rnd<(MAGIC_CARD_INFO-pcount); rnd++) {
            for (var dpl=0; dpl<pcount; dpl++) {
                var card = info.card_decks.player_cards.shift();
                info.players.plist[dpl].cards.push(card);
            }
        }
        var results = JSON.stringify(info);
        sessionStorage.setItem('game_data', results);
        return results;
    }

    return {
        initialize:initialize,
        deal:deal
    };
}();
