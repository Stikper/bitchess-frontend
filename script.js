const blur_area = document.getElementById('blur_area');
const board = document.getElementById("board");
const menu = document.getElementById("menu");
const waiting_message = document.getElementById("waiting");
const zone_counter = document.getElementById("moves_to_zone_change");
const chest_counter = document.getElementById("moves_to_chest");
const deathmatch_counter = document.getElementById("moves_to_deathmatch");
const player_clock = document.getElementById("player_time");
const opponent_clock = document.getElementById("opponent_time");
let game_interval_id = null;
let received_data = null;
received_data = {board:[],current_move:"white",deathmatch:0,next_chest:0,next_zone:0,time:{black:600,white:600}} //default data
let command = "none";


function preSetup(){
    window.addEventListener('resize', function (){styleCheck()});
    styleCheck();
    createBoard();
}

function styleCheck() {
    let clientWidth =  document.documentElement.clientWidth;
    let clientHeight =  document.documentElement.clientHeight;
    if (clientWidth / clientHeight >= 1.94) {
        document.body.style.setProperty('--main_border_radius', '3.0303vh');
    } else {
        document.body.style.setProperty('--main_border_radius', '1.562vw');
    }
}

function createBoard() {
    let color_flag = false;
    for (let i = 8; i>0; i--) {
        for(let j = 1; j < 8 + 1; j++) {
            let square = document.createElement('div');
            if (color_flag) square.className = 'square black_square';
            else square.className = 'square white_square';
            color_flag = !color_flag;
            square.id = String.fromCharCode(64 + j) + i;
            board.appendChild(square);
        }
        color_flag = !color_flag;
    }
}

function playByRoomId(event) {
    event.preventDefault();
    let room_id = document.getElementById("room_id").value;
    let request = "room_id=" + room_id + "&query=connect";
    let xhr = new XMLHttpRequest();
    xhr.open("GET","/python/join?" + request, true);
    xhr.timeout = 10000;
    xhr.send(null);
    xhr.onload = function() {
        if(xhr.response === "created") {
            waiting_message.classList.remove("hidden");
            menu.classList.add("hidden");
            let waiting = setInterval(function () {
                let request = "room_id=" + room_id + "&query=status";
                let xhr = new XMLHttpRequest();
                xhr.open("GET","/python/join?" + request, true);
                xhr.timeout = 10000;
                xhr.send(null);
                xhr.onload = function() {
                    if(xhr.response === "2") {
                        clearInterval(waiting);
                        blur_area.classList.remove("blurred");
                        waiting_message.classList.add("hidden");
                        game_interval_id = setInterval(function () {gameHandler(room_id)}, 250);
                    } else {
                        console.log(xhr.response)
                    }
                }
            },1000);
        } else if(xhr.response === "started") {
            blur_area.classList.remove("blurred");
            menu.classList.add("hidden");
            game_interval_id = setInterval(function () {gameHandler(room_id)}, 250);
        } else {console.log(xhr.response);}
    }
}

function playOnRandomRoom() {
    let room_id = "random";
    let request = "room_id=" + room_id + "&query=connect";
    let xhr = new XMLHttpRequest();
    xhr.open("GET","/python/join?" + request, true);
    xhr.timeout = 10000;
    xhr.send(null);
    xhr.onload = function() {
        if(xhr.response.split(" ")[1] === "created") {
            room_id = xhr.response.split(" ")[0];
            waiting_message.classList.remove("hidden");
            menu.classList.add("hidden");
            let waiting = setInterval(function () {
                let request = "room_id=" + room_id + "&query=status";
                let xhr = new XMLHttpRequest();
                xhr.open("GET","/python/join?" + request, true);
                xhr.timeout = 10000;
                xhr.send(null);
                xhr.onload = function() {
                    if(xhr.response === "2") {
                        clearInterval(waiting);
                        blur_area.classList.remove("blurred");
                        waiting_message.classList.add("hidden");
                        game_interval_id = setInterval(function () {gameHandler(room_id)}, 250);
                    } else {
                        console.log(xhr.response)
                    }
                }
            },1000);
        } else if(xhr.response.split(" ")[1] === "started") {
            room_id = xhr.response.split(" ")[0];
            blur_area.classList.remove("blurred");
            menu.classList.add("hidden");
            game_interval_id = setInterval(function () {gameHandler(room_id)}, 250);
        } else {console.log(xhr.response);}
    }
}

function gameHandler (room_id) {
    let request = "room_id=" + room_id;
    if(command !== "none") {
        request = request + "&command=" + command;
        command = "none";
    }
    let xhr = new XMLHttpRequest();
    xhr.open("GET","/python/getGameData?" + request, true);
    xhr.responseType = "json";
    xhr.timeout = 1000;
    xhr.send(null);
    xhr.onload = function() {
        received_data = xhr.response;
    }
    zone_counter.innerHTML = received_data.next_zone + " " + russianLanguageProblem(received_data.next_zone);
    chest_counter.innerHTML = received_data.next_chest + " " + russianLanguageProblem(received_data.next_chest);
    deathmatch_counter.innerHTML = received_data.deathmatch + " " + russianLanguageProblem(received_data.deathmatch);
    opponent_clock.innerHTML = Math.floor(received_data.time.black / 60) + ":" + Math.ceil(received_data.time.black) % 60;
    player_clock.innerHTML = Math.floor(received_data.time.white / 60) + ":" + Math.ceil(received_data.time.white) % 60;
}

function russianLanguageProblem(quantity){
    if(quantity >=10 && quantity <= 20){
        return "ходов";
    } else if(quantity % 10 === 1){
        return "xoд";
    } else if (quantity % 10 >= 2 && quantity % 10 <= 4){
        return "хода";
    } else {
        return "ходов";
    }
}

function sendCommand(event) {
    event.preventDefault();
    command = document.getElementById("command_line").value
    document.getElementById("command_line").value = null;
}
