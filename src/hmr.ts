const DEBOUNCE_TIME = 10;

let RELOAD_TIMEOUT: Timer;

function connect() {
    let socket = new WebSocket("ws://localhost:10000/ws");

    socket.onopen = function (e) {
        console.log("HMR is ready.");
    };

    socket.onmessage = function (event) {
        clearTimeout(RELOAD_TIMEOUT);
        RELOAD_TIMEOUT = setTimeout(() => {
            location.reload();
        }, DEBOUNCE_TIME);
    };

    socket.onclose = function (e) {
        connect();
    };

    socket.onerror = function (err) {
        socket.close();
    };
}

connect();
