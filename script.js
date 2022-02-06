let blur_area = null;

function preSetup(){
    window.addEventListener('resize', function (){styleCheck()});
    blur_area = document.getElementById('blur_area');
    styleCheck();
}

function styleCheck() {
    let clientWidth =  document.documentElement.clientWidth;
    let clientHeight =  document.documentElement.clientHeight;
    if (clientWidth / clientHeight >= 1.94) {
        blur_area.style.setProperty('--main_border_radius', '3.08vh');
        blur_area.style.setProperty('--clock_margin', '5.52vh');
    } else {
        blur_area.style.setProperty('--main_border_radius', '1.59vw');
        blur_area.style.setProperty('--clock_margin', '2.85vw');
    }
}
