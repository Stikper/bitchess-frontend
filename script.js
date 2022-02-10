let blur_area = null;
let board = null;
let menu = null;
let waiting_message = null;
let game_interval_id = null;


function preSetup(){
    window.addEventListener('resize', function (){styleCheck()});
    blur_area = document.getElementById('blur_area');
    board = document.getElementById("board");
    menu = document.getElementById("menu");
    waiting_message = document.getElementById("waiting");
    styleCheck();
    createBoard();
}

function styleCheck() {
    let clientWidth =  document.documentElement.clientWidth;
    let clientHeight =  document.documentElement.clientHeight;
    if (clientWidth / clientHeight >= 1.94) {
        document.body.style.setProperty('--main_border_radius', '3.08vh');
        document.body.style.setProperty('--clock_margin', '5.52vh');
    } else {
        document.body.style.setProperty('--main_border_radius', '1.59vw');
        document.body.style.setProperty('--clock_margin', '2.85vw');
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
            waiting_message.classList = "";
            menu.classList = "hidden";
            let waiting = setInterval(function () {
                let request = "room_id=" + room_id + "&query=status";
                let xhr = new XMLHttpRequest();
                xhr.open("GET","/python/join?" + request, true);
                xhr.timeout = 10000;
                xhr.send(null);
                xhr.onload = function() {
                    if(xhr.response === "2") {
                        clearInterval(waiting);
                        blur_area.classList = "";
                        waiting_message.classList = "hidden";
                        game_interval_id = setInterval(function () {gameHandler(room_id)}, 250);
                    } else {
                        console.log(xhr.response)
                    }
                }
            },1000);
        } else if(xhr.response === "started") {
            blur_area.classList = "";
            menu.classList = "hidden";
        } else {console.log(xhr.response);}
    }
}

function gameHandler (room_id) {
    let received_data = null;
    let request = "room_id=" + room_id + "&query=none&moves=none"
    let xhr = new XMLHttpRequest();
    xhr.open("GET","/python/getGameData?" + request, true);
    xhr.responseType = "json";
    xhr.timeout = 1000;
    xhr.send(null);
    xhr.onload = function() {
        received_data = xhr.response;
    }
}