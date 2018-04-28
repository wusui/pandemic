/* globals useSpecWindow */
var specialSpecial = function() {

    function clickedOnForecast(info, citymap) {
        // alert("this is a forecast card\nthis is the second line\nthis is in specialSpecial");
        info.misc.special_action = utilities.SA_FORECAST;
        useSpecWindow.common_stuff(info, citymap);
        // alert(JSON.stringify(info.card_decks.infections));
        inp_lines = [];
        inp_lines.push('Forecast Card played.');
        inp_lines.push('Sort the following cards.');
        inp_lines.push('When finished, click DONE.');
        var line_filler = useSpecWindow.print_head(inp_lines);
        info.display.special_text_fields = line_filler;
        info.display.special_callback = useSpecWindow.FORECAST_CALLBACK;
        // display cards to sort.
        // add + - stuff
        // add done button.
    }

    function forecast_callback(x, y, info) {
        // this code will eventually handle all the sorting and do this
        // cleanup only after the done button is hit.
        // It will also do the sorting if + or - is clicked on.
        info.misc.special_action = 0;
        useSpecWindow.clean_up(info);
    }

    return {
        clickedOnForecast:clickedOnForecast,
        forecast_callback:forecast_callback
    };
}();
