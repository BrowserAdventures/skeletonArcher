class Canvas                       // Canvas - container
{
    constructor()
    {
        this.ctx = document.getElementById('canvas').getContext('2d');
        this.W = canvas.width; //= 16*64;
        this.H = canvas.height;//= 16*64; //=window.innerHeight;
    }
}

class Vector extends Canvas         // Vector - template
{
    constructor(width, height)
    {
        super();
        this.x = null;
        this.y = null;
        this.size = {w: width, h: height};
        this.vel = {x: null, y: null};
    }

    get right() {
        return this.x + this.size.w;
    }
    get bottom() {
        return this.y + this.size.h;
    }
    get left() {
        return this.x;
    }
    get top() {
        return this.y;
    }
}

class Sprite extends Vector         // Sprite - template
{
    constructor(path, fwNumber, fhNumber)
    {
        super(32*2, 32*2);              // size width/height
        this.img = new Image();
        this.img.src = path;            // image to load
        this.frame = {
            w: this.img.width/fwNumber, // frame width
            h: this.img.height/fhNumber // frame height
        };
        this.crop = { x:0, y:0 };       // X & Y pos to crop image
        this.counter = { x:0, y:0 };    // tracks animation interval
        this.key = {left:false, right:false, up:false, down:false, spacebar:false};
    }
    animate(frameSpeed)
    {
        //  creates animation loop  //
        this.columnSpeed = Math.floor(this.counter.x) % this.columnLength;
        this.rowSpeed = Math.floor(this.counter.y) % this.rowLength;

        this.columnSpeed *= this.frame.w;//+this.frameSpeed; // amount to increase each frame
        this.rowSpeed *= this.frame.h;// +this.frameSpeed;

        this.counter.x += frameSpeed || 0.2; // column animation speed
        this.counter.y += frameSpeed || 0.2; // row animation speed

        this.draw(); // draws image
    }

    draw() {
        this.ctx.drawImage(this.img,
            this.crop.x, this.crop.y,
            this.frame.w, this.frame.h,
            this.x, this.y,
            this.size.w, this.size.h
        );
    }

    update(columnX, rowY, columnLength, rowLength) {
        this.columnLength = columnLength;           // update column length
        this.columnX = columnX * this.frame.w;      // update column start position
        this.crop.y = rowY * this.frame.h;          // updates the row position
        this.crop.x = this.columnX+this.columnSpeed // implements the animation

        this.rowLength = rowLength || null;
        if(this.rowLength !== null) {
            this.rowY = rowY * this.frame.h;
            this.crop.y = this.rowY+this.rowSpeed || null;}
    }

    boundaries()
    {
        if (this.left < 0) {
            this.vel.x = 0;
            this.key.left = false;
        };
        if (this.right >= this.W) {
            this.vel.x = 0;
            this.key.right = false;
        };
        if (this.bottom >= this.H) {
            this.vel.y = 0;
            this.key.down = false;
        };
        if (this.top <= 0) {
            this.vel.y = 0;
            this.key.up = false;
        };
    }
}

class Player extends Sprite         // Player
{
    constructor()
    {
        super('img/skeleton_bow_.png', 13, 21);
        this.x = this.W/3; this.y = this.H/2;
        this.speed = 2 // move speed
        this.stop = true; this.start = false;
        this.direction = {right:false, left:false, up:false, down:false};
    }

    init()
    {
        this.animate(this.frameSpeed);
        this.boundaries();
        this.move();
    }

    move()
    {
        this.vel.x = 0;
        this.vel.y = 0;

        // LEFT //
        if(this.key.left &&!(this.key.right || this.key.up || this.key.down))
        {
            this.update(0, 9, 9);
            this.stop = false;
            this.start = true;
            this.direction = {right:false, left:true, up:false, down:false, attack:17};
            this.vel.x = -this.speed;
        }

        // RIGHT //
        if(this.key.right &&!(this.key.left || this.key.up || this.key.down))
        {
            this.update(0, 11, 8);
            this.stop = false;
            this.start = true;
            this.direction = {right:true, left:false, up:false, down:false, attack:19};
            this.vel.x = this.speed;
        }

        // UP //
        if(this.key.up &&!(this.key.right || this.key.left || this.key.down))
        {
            this.update(0, 8, 9);
            this.stop = false;
            this.start = true;
            this.direction = {right:false, left:false, up:true, down:false, attack:16};
            this.vel.y = -this.speed;
        }

        // DOWN //
        if(this.key.down &&!(this.key.right || this.key.up || this.key.left))
        {
            this.update(0, 10, 9);
            this.stop = false;
            this.start = true;
            this.direction = {right:false, left:false, up:false, down:true, attack:18};
            this.vel.y = this.speed;

        }

        // SPACEBAR - Attack //
        if(this.key.spacebar)
        {
            if(this.start) {
                this.frameSpeed = 0.4; // updates attack animation-loop-speed
                this.update(0, (this.direction.attack||0), 13); // updates attack-direction
            }
            this.vel.y = 0; // stop player if attacking
            this.vel.x = 0; // stop player if attacking
            this.stop = false;
        }

        // updates standing direction
        if(this.stop)
        {
            if(this.direction.right) this.update(0, 7, 1);
            if(this.direction.left) this.update(0, 9, 1);
            if(this.direction.up) this.update(0, 8, 1);
            if(this.direction.down) this.update(0, 10, 1);
        }

        // frame to draw at game start
        if(!this.start) this.update(0, 6, 1);

        // updates walking animation-loop-speed
        if(!this.key.spacebar) this.frameSpeed = 0.2;

        this.x += this.vel.x;
        this.y += this.vel.y;
        this.stop = true; // stops animation loop
    }
}

class zombieSkeleton extends Sprite         // zombieSkeleton
{
    constructor(column)
    {
        super('img/zombie_n_skeleton.png', 9, 4);
        this.size = {w: 32*2.5, h:32*2.5};
        this.stop = true; this.start = false;
        this.direction = {right:false, left:false, up:false, down:false};

        this.row = Math.floor(Math.random()*(4 -0)+0); // randomizes row
        this.column = column || 0;                     // column number of frame

        this.x = Math.floor(Math.random()*(            // random x position
            (this.W-this.size.w)-this.size.w)+this.size.w);
        this.y = Math.floor(Math.random()*(            // random y position
            (this.H-this.size.w)-this.size.h)+this.size.h);

        this.vel = {
                        x: Math.floor(Math.random()*(2 -1)+1),
                        y: Math.floor(Math.random()*(2 -1)+1),
        };
    }

    init()
    {
        this.update(this.column, this.row, 3);
        this.animate();
        this.wall();
        this.move();
    }

    move()
    {
        if(this.row == 1) { // left
            this.vel.y = 0;
            this.vel.x *= -this.vel.x;
        }
        if(this.row == 2) { // right
            this.vel.y = 0;
        }
        if(this.row == 3) { // up
            this.vel.x = 0;
            this.vel.y *= -this.vel.y;
        }
        if(this.row == 0) { // down
            this.vel.x = 0;
        }

        this.x += this.vel.x;
        this.y += this.vel.y;
    }

    wall()
    {
        if (this.right <= 0) {
            this.x = this.W-10;
        };
        if (this.left >= this.W) {
            this.x = 0;
        };
        if (this.top >= this.H) {
            this.y = 0;
        };
        if (this.bottom <= 0) {
            this.y = this.H;
        };
    }
}

class HP_Potion extends Sprite
{
    constructor()
    {
        super('img/items.png', 14, 8)
        this.size = {w: 25, h: 25};
        this.x = this.W/2; this.y = this.H/2;
    }
    init()
    {
        this.update(4, 3, 1);
        this.animate();
    }
}


class Arrow extends Vector {         // Arrow - template
    constructor()
    {
        super(32, 10);
    }

    draw(path)
    {
        this.img = new Image();
        this.img.src = path;

        this.ctx.drawImage(
            this.img,
            this.x, this.y,
            this.size.w, this.size.h
        );
    }

}
class Projectile extends Arrow     // Arrow - Projectile
{
    constructor()
    {
        super();
        this.arrows = [];
        this.Arrow = new Arrow;
        this.timer = 0;
        this.amout = 0;
        this.fire = false;
        this.hit = false;
        this.direction = {right:false, left:false, up:false, down:false};
    }
    init(DT)
    {

        for (var i = 0; i < this.arrows.length; i++)
        {
            this.Arrow.x = this.arrows[i][0];
            this.Arrow.y = this.arrows[i][1]+main.player.size.h/2-6;

            // draws left-arrow image
            if(main.player.direction.left) {
                this.Arrow.draw('img/arrow_left.png');
                this.Arrow.size = {w: 32, h:10};
            }
            // draws right-arrow image
            else if(main.player.direction.right) {
                this.Arrow.draw('img/arrow_right.png');
                this.Arrow.size = {w: 32, h:10};
            }
            // draws right-up image
            else if(main.player.direction.up) {
                this.Arrow.draw('img/arrow_up.png');
                this.Arrow.size = {w: 10, h:32};
            }
            // draws right-arrow image
            else if(main.player.direction.down) {
                this.Arrow.draw('img/arrow_down.png');
                this.Arrow.size = {w: 10, h:32};
            }
        }

        this.shoot();
        this.move(DT);
    }

    move(DT)
    {
        this.timer = this.timer +DT;
        for (var i = 0; i < this.arrows.length; i++) {
            if (main.player.direction.left) {
                this.arrows[i][0] -=15;
            }
            else if (main.player.direction.right) {
                this.arrows[i][0] +=15;
            }
            else if (main.player.direction.up) {
                this.arrows[i][1] -=15;
            }
            else if (main.player.direction.down) {
                this.arrows[i][1] +=15;
            }
            // deletes arrow every second
            if (Math.round(this.timer) >= 1) {
                this.arrows.splice(i, 1);
                this.timer = 0;
            }
            if (this.hit) {
                this.arrows.splice(i, 1);
            }
        }
        this.hit = false;
    }

    shoot()
    {
        if (this.fire && this.arrows.length <= 0) {
            this.arrows.push([main.player.x+main.player.size.w/2-2, main.player.y]);
        }
        this.fire = false;
    }
}

const scoreBoard =
{
    size: 5,
    color: 'gold',
    hp: 10,
    score: 0,
    timer: 0,

    init: function(DT) {
        let C = new Canvas;
        this.timer = this.timer +DT;

        // draws score //
        C.ctx.fillStyle = 'gold';
        C.ctx.font = '15px Arial';
        C.ctx.fillText("Kills :  "+Math.round(this.score), C.W/2-40, C.H-10);


        // draws hps //
        C.ctx.fillStyle ='rgba(255, 25, 25, 0.8)';
        C.ctx.font = '17px Arial';
        for (let i = 0; i < this.hp; i++) {
            let x = (this.size*2.5)+(5*i); let y = main.player.y-20;
            C.ctx.beginPath();
            C.ctx.fillStyle ='red';
            C.ctx.fillRect(main.player.x, y, (this.size*2.5)+(5*10), this.size);
            C.ctx.fillStyle ='green';
            C.ctx.fillRect(main.player.x, y, x, this.size);
            C.ctx.stroke();
            C.ctx.save();
        }
    },
}

class Main extends Canvas           // MAIN APPLICATION
{
    constructor()
    {
        super();
        this.enemys = [];
        this.hp_potions = [];
        this.totalEnemys = 6;
        this.setup();
        this.loop();
    }

    setup() // creates an instance of object (outside of main loop)
    {
        this.player = new Player;
        this.arrow = new Projectile;

        for (var i = 0; i < this.totalEnemys; i++) {
            this.enemys.push(i);
        }
        for(var i = 0; i < this.enemys.length; i++) {
            let column = 0;
            if(i < this.totalEnemys) column = 3;
            this.enemys[i] = new zombieSkeleton(column);
        }

        for (var i = 0; i < 1; i++) { // hp_potions
            this.hp_potions.push(i);
        }
        for(var i = 0; i < this.enemys.length; i++) {
            this.hp_potions[i] = new HP_Potion;
        }
    }

    update(DT)
    {
        this.timer++;
        this.player.init()
        this.arrow.init(DT)
        scoreBoard.init(DT)
        this.collisionHandler()
        this.enemys.forEach(enemy => enemy.init() )
        //if(Math.round(this.timer) >= 100 % 0)	//every 4 sec
            this.hp_potions.forEach(hp_potion => hp_potion.init() )
        if(scoreBoard.hp <= 0) this.reset(); // resets game if HP = 0
    }

    collisionHandler()
    {
        for (let i in this.enemys) {
            if (this.collisionDetection(this.arrow.Arrow, this.enemys[i])) {
                this.enemys.splice(i, 1);
                this.enemys.push(new zombieSkeleton);
                this.arrow.hit = true;
                scoreBoard.score += 1;
            }

            if (this.collisionDetection(this.player, this.enemys[i], 10, 20)) {
                this.enemys.splice(i, 1);
                this.enemys.push(new zombieSkeleton);
                scoreBoard.hp -=0.5;
            }
        }

        for (let i in this.hp_potions) {
            if (this.collisionDetection(this.player, this.hp_potions[i], 10, 20)) {
                this.hp_potions.splice(i, 1);
                if(scoreBoard.hp < 10)
                scoreBoard.hp +=0.5;
            }
        }
    }

    collisionDetection(id_1, id_2, adjustX, adjustY) {
        this.adjust =  // change collisionDetection square size (optional)
        {
            x: adjustX || 0,
            y: adjustY || 0
        };
        return id_1.x+this.adjust.x <= id_2.x + id_2.size.w
            && id_2.x+this.adjust.x <= id_1.x + id_1.size.w
            && id_1.y+this.adjust.y <= id_2.y + id_2.size.h
            && id_2.y+this.adjust.y <= id_1.y + id_1.size.h
    }

    objectDistance(id_1, id_2) {
        this.distance =
        {   x: id_2.x -id_1.x,
            y: id_2.y -id_1.y,
        }

        if(this.distance.x > 0) {
            id_1.x += 0.5;
            //id_1.y = 0;
            id_1.direction = {right:false, left:true, down:false, up:false};
        }
        else {
            id_1.x -= 0.5;
            id_1.direction = {right:true, left:false, down:false, up:false};
        }
        if(this.distance.y > 0) {
            //id_1.x = 0;
            id_1.y += 0.5;
            id_1.direction = {right:false, left:false, down:true, up:false};
        }
        else {
            id_1.y -= 0.5;
            id_1.direction = {right:false, left:false, down:false, up:true};
        }
    }

    reset() // resets the game
    {
        scoreBoard.hp = 10;
        scoreBoard.score = 0;
        this.enemys = [];
        this.setup();
    }

    loop(lastTime) { // creates main loop
        const callback = (Mseconds) => {
            this.ctx.clearRect(0, 0, this.W, this.H);
            if(lastTime)
                this.update((Mseconds -lastTime)/1000);
            lastTime = Mseconds;
            requestAnimationFrame(callback);
        }
        callback();
    }
}





//window.onload = main = new Main; // initiates game
