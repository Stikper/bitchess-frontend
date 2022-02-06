let blur_area = null;
let board = null;
let menu;

function preSetup(){
    window.addEventListener('resize', function (){styleCheck()});
    blur_area = document.getElementById('blur_area');
    board = document.getElementById("board");
    menu = document.getElementById("menu")
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