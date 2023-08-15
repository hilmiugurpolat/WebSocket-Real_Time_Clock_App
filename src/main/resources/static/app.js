let stompClient = null;
let intervalId;

function connect() {
    const socket = new SockJS('/gs-guide-websocket');
    stompClient = new StompJs.Client({
        brokerURL: 'ws://localhost:8080/gs-guide-websocket'
    });
    stompClient.onConnect = (frame) => {
        console.log('Connected: ' + frame);
        setConnected(true);
        stompClient.subscribe('/topic/time', function (response) {
            console.log(response.body);
            $('#time').val(response.body);
        });
    };

    stompClient.onWebSocketError = (error) => {
        console.error('Error with websocket', error);
    };

    stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    stompClient.activate();
}
function disconnect() {
    if (stompClient !== null) {
        stompClient.webSocket.close();
        stompClient = null; // StompClient nesnesini null yaparak silin
        console.log("Disconnected");
        setConnected(false);
        clearInterval(intervalId);
    }
}



function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        intervalId = setInterval(updateTime, 1000);
    }
}

function updateTime() {
    const currentTime = new Date().toLocaleTimeString();
    $("#time").val(currentTime);
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $("#connect").click(() => connect());
    $("#disconnect").click(() => disconnect());
});
