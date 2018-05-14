const arrow = {
    left:37,
    right:39,
    up:38,
    down:40,
    spacebar:32
};

const Controller = {

    /*__________________  ARROWKEYS  __________________*/
    PRESS: document.onkeydown = function(E)
    {
        if (E.keyCode == arrow.left) main.player.key.left = true;
        if (E.keyCode == arrow.right) main.player.key.right = true;
        if (E.keyCode == arrow.up) main.player.key.up = true;
        if (E.keyCode == arrow.down) main.player.key.down = true;
        if (E.keyCode == arrow.spacebar) {
            main.arrow.fire = true;
            main.player.key.spacebar = true;
        }

        // prevents webpage scrolling
        if([32, 37, 38, 39, 40].indexOf(E.keyCode) > -1) E.preventDefault();
    },
    RELEASE: document.onkeyup = function(E)
    {
        if (E.keyCode == arrow.left) main.player.key.left = false;
        if (E.keyCode == arrow.right) main.player.key.right = false;
        if (E.keyCode == arrow.up) main.player.key.up = false;
        if (E.keyCode == arrow.down) main.player.key.down = false;
        if (E.keyCode == arrow.spacebar) {
            main.player.key.spacebar = false;
            main.arrow.fire = false;
        }
    },


    /*__________________  MOUSE  __________________*/
    MOVE: onmousemove = function(MOUSE) // mouse-move controls
    {
        var mouseX = MOUSE.clientX - canvas.offsetLeft;
        var mouseY = MOUSE.clientY - canvas.offsetTop;
        mouseX -= main.player.x+5;
        mouseY -= main.player.y+5;

        MOUSE.preventDefault(); // stops webpage scrolling
    },
    CLICK: onclick = function(MOUSE) // mouse-click controls
    {
        //main.bullet.fire = true;
        MOUSE.preventDefault(); // stops webpage scrolling
    },
    SIDE_CLICK: oncontextmenu = function(MOUSE) // mouse-side_click controls
    {
        //MOUSE.preventDefault(); // stops webpage scrolling
    },
}
