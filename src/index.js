"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let WIDTH = canvas.width;
let HEIGHT = canvas.height;

const FPS = 60;

let keys_pressed = {
    up: false,
    down: false,
    left: false,
    right: false,
    turn_left: false,
    turn_right: false,
    shooting: false
};

let camera = {
    x: 0,
    y: 0,
    width: WIDTH,
    height: HEIGHT,
    buffer: 100
};

let player = new Square(200, 200, 18);

const _void = new Void(4000, 1000, "red");

let _interval = setInterval(function() {
    ctx.fillStyle = "rgba(25, 25, 26, 0.2)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.save();

    if (player.position.x < camera.x + camera.buffer) camera.x = player.position.x - camera.buffer;
    else if (player.position.x + player.size > camera.x + camera.width - camera.buffer) camera.x = player.position.x + player.size - camera.width + camera.buffer;

    if (player.position.y < camera.y + camera.buffer) camera.y = player.position.y - camera.buffer;
    else if (player.position.y + player.size > camera.y + camera.height - camera.buffer) camera.y = player.position.y + player.size - camera.height + camera.buffer;
    
    console.log(camera.x, camera.y);

    ctx.translate(-camera.x, -camera.y);

    _void.render(ctx);

    player.update(keys_pressed, _void);
    player.render(ctx);

    player.projectiles.forEach((projectile) => {
        projectile.update();
        projectile.render(ctx);
    });

    ctx.restore();
}, 1000 / FPS);


addEventListener("resize", () => {
    WIDTH = innerWidth;
    HEIGHT = innerHeight; 
});


addEventListener("keydown", (event) => {
    if (event.key === "w") {
        keys_pressed.up = true;
    } 

    if (event.key === "s") {
        keys_pressed.down = true;
    }

    if (event.key === "a") {
        if (player instanceof Square) keys_pressed.left = true;
        else if (player instanceof Triangle || player instanceof Diamond) keys_pressed.turn_left = true;
    }

    if (event.key === "d") {
        if (player instanceof Square) keys_pressed.right = true;
        else if (player instanceof Triangle || player instanceof Diamond) keys_pressed.turn_right = true;
    }

    if (event.key === "ArrowLeft") {
        if (player instanceof Square) keys_pressed.turn_left = true;
    }

    if (event.key === "ArrowRight") {
        if (player instanceof Square) keys_pressed.turn_right = true;
    }

    if (event.key === " ") {
        keys_pressed.shooting = true;
    }
});

addEventListener("keyup", (event) => {
    if (event.key === "w") {
        keys_pressed.up = false;
    } 

    if (event.key === "s") {
        keys_pressed.down = false;
    }

    if (event.key === "a") {
        if (player instanceof Square) keys_pressed.left = false;
        else if (player instanceof Triangle || player instanceof Diamond) keys_pressed.turn_left = false;
    }

    if (event.key === "d") {
        if (player instanceof Square) keys_pressed.right = false;
        else if (player instanceof Triangle || player instanceof Diamond) keys_pressed.turn_right = false;
    }

    if (event.key === "ArrowLeft") {
        if (player instanceof Square) keys_pressed.turn_left = false;
    }

    if (event.key === "ArrowRight") {
        if (player instanceof Square) keys_pressed.turn_right = false;
    }

    if (event.key === " ") {
        keys_pressed.shooting = false;
    }
});


addEventListener("keypress", (event) => {
    if (event.key === "1") {
        player = new Square(200, 200, 23);
    }

    if (event.key === "2") {
        player = new Triangle(200, 200, 16);
    }

    if (event.key === "3") {
        player = new Diamond(200, 200, 15);
    }
});

const _shooting_interval = setInterval(function() {
    if (keys_pressed.shooting) {
        if (player instanceof Triangle) {
            const centroid = player.calculate_centroid();
            
            const projectile_1 = new Projectile(centroid[0], centroid[1], player.shooting_size, player.color, player.angle - 1.5, player.shooting_speed);
            const projectile_2 = new Projectile(centroid[0], centroid[1], player.shooting_size, player.color, player.angle + 1.5, player.shooting_speed);
    
            const projectiles = [projectile_1, projectile_2];
            player.projectiles.push(...projectiles);

        } else if (player instanceof Diamond) {
            const centroid = player.calculate_centroid();

            const projectile_1 = new Projectile(centroid[0], centroid[1], player.shooting_size, player.color, player.angle, player.shooting_speed);
            const projectile_2 = new Projectile(centroid[0], centroid[1], player.shooting_size, player.color, player.angle + 180, player.shooting_speed);

            const projectiles = [projectile_1, projectile_2];
            player.projectiles.push(...projectiles);
        }

    }
}, 1000 / 5);