var handleInput = function() {

    function mouseSwitch(evt) {
        alert(evt.clientX.toString()+", "+evt.clientY.toString())
    }

    return {
        mouseSwitch:mouseSwitch
    }
}()
