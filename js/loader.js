/*      initiates game after loading images       */


const image = {
    skeleton: new Image(),
    zombieSkeleton: new Image(),
    arrow_right: new Image(),
    arrow_left: new Image(),
    arrow_up: new Image(),
    arrow_down: new Image(),
    hp_potion: new Image(),
}

image.skeleton.src = 'img/skeleton_bow_.png'
image.zombieSkeleton.src = 'img/zombie_n_skeleton.png'
image.arrow_right.src = 'img/arrow_right.png'
image.arrow_left.src = 'img/arrow_left.png'
image.arrow_up.src = 'img/arrow_up.png'
image.arrow_down.src = 'img/arrow_down.png'
image.hp_potion.src = 'img/itmes.png'


image.skeleton.onload =
image.zombieSkeleton.onload =
image.arrow_right.onload =
image.arrow_left.onload =
image.arrow_up.onload =
image.arrow_down.onload =
image.hp_potion.onload =
function()
{
    main = new Main;
}
