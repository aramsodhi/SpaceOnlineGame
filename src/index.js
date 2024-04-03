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

class Projectile {
    constructor(_x, _y, _size, _color, _angle) {
        this.position = {
            x: _x,
            y: _y
        };

        this.size = _size;

        this.color = _color;

        this.angle = _angle;
    }

    update() {
        this.position.x += Math.cos((this.angle - 90) * Math.PI / 180) * 5;
        this.position.y += Math.sin((this.angle - 90) * Math.PI / 180) * 5;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, false);
    	ctx.fillStyle = this.color;
    	ctx.fill();
    	ctx.closePath();
    }
}

class Player {
    constructor(_size, _color, _type) {
        this.size = _size;
        this.color = _color;

        this.position = {
            x: 200,
            y: 200
        };

        this.angle = 0;

        this.x_vel = 0;
        this.y_vel = 0;

        this.type = _type;

        this.friction = 0.9;
        if (this.type === "square") {
            this.friction = 0.985;
        } else if (this.type === "triangle") {
            this.friction = 0.96;
        }

        this.square_max_speed = 12;
        this.triangle_max_speed = 25;

        this.projectiles = [];
    }

    update(keys_pressed) {
        if (this.type === "square") {
            if (keys_pressed.turn_left) this.angle -= 5;
            else if (keys_pressed.turn_right) this.angle += 5;
    
            if (keys_pressed.up) {
                this.y_vel -= 0.27;
            }
    
            if (keys_pressed.down) {
                this.y_vel += 0.27;
            }
    
            if (keys_pressed.left) {
                this.x_vel -= 0.27;
            }
        
            if (keys_pressed.right) {
                this.x_vel += 0.27;
            }
    
            if (this.x_vel > this.square_max_speed) this.x_vel = this.square_max_speed;
            else if (this.x_vel < -this.square_max_speed) this.x_vel = -this.square_max_speed;
    
            if (this.y_vel > this.square_max_speed) this.y_vel = this.square_max_speed;
            else if (this.y_vel < -this.square_max_speed) this.y_vel = -this.square_max_speed;
    
            this.x_vel *= this.friction;
            this.y_vel *= this.friction;
    
            this.position.x += this.x_vel;
            this.position.y += this.y_vel;
        } else if (this.type === "triangle") {
            if (keys_pressed.turn_left) this.angle -= 4;
            else if (keys_pressed.turn_right) this.angle += 4;
    
            if (keys_pressed.up) {
                this.x_vel += Math.cos((this.angle - 90) * Math.PI / 180) * 0.5;
                this.y_vel += Math.sin((this.angle - 90) * Math.PI / 180) * 0.5;
            }

            if (keys_pressed.down) {
                this.x_vel -= Math.cos((this.angle - 90) * Math.PI / 180) * 0.35;
                this.y_vel -= Math.sin((this.angle - 90) * Math.PI / 180) * 0.35;
            }

            if (this.x_vel > this.triangle_max_speed) this.x_vel = this.triangle_max_speed;
            else if (this.x_vel < -this.triangle_max_speed) this.x_vel = -this.triangle_max_speed;

            if (this.y_vel > this.triangle_max_speed) this.y_vel = this.triangle_max_speed;
            else if (this.y_vel < -this.triangle_max_speed) this.y_vel = -this.triangle_max_speed;

            this.x_vel *= this.friction;
            this.y_vel *= this.friction;

            this.position.x += this.x_vel;
            this.position.y += this.y_vel;
        }

        if (keys_pressed.shooting) {
            this.projectiles.push(new Projectile(this.position.x, this.position.y, 10, "red", this.angle));
        }
    }


    render(ctx) {
       
        if (this.type === "square") {
            ctx.save();
            ctx.translate(this.position.x + (this.size / 2), this.position.y + (this.size / 2));
            ctx.rotate(this.angle * Math.PI / 180);
            ctx.translate(-(this.position.x + (this.size / 2)), -(this.position.y + (this.size / 2)));
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
            ctx.restore();

        } else if (this.type === "triangle") {
            ctx.save();
            ctx.translate(this.position.x, this.position.y + (this.size / 2));
            ctx.rotate(this.angle * Math.PI / 180);
            ctx.translate(-this.position.x, -(this.position.y + (this.size / 2)));
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(this.position.x + (this.size / 2), this.position.y + 1.35 * this.size)
            ctx.lineTo(this.position.x - (this.size / 2), this.position.y + 1.35 * this.size);
            ctx.fill();
            ctx.restore();
        }
    }
}

const player = new Player(25, "magenta", "triangle");

let _interval = setInterval(function() {
    ctx.fillStyle = "rgba(25, 25, 26, 0.2)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    player.projectiles.forEach((projectile) => {
        projectile.update();
        projectile.render(ctx);
    });

    player.update(keys_pressed);
    player.render(ctx);
}, 1000 / FPS);


addEventListener("resize", () => {
    WIDTH = innerWidth;
    HEIGHT = innerHeight; 
});


addEventListener("keydown", (event) => {
    if (player.type === "square") {
        if (event.key === "w") {
            keys_pressed.up = true;
        } 
    
        if (event.key === "s") {
            keys_pressed.down = true;
        }
    
        if (event.key === "a") {
            keys_pressed.left = true;
        }
    
        if (event.key === "d") {
            keys_pressed.right = true;
        }
    
        if (event.key === "ArrowLeft") {
            keys_pressed.turn_left = true
        }
    
        if (event.key === "ArrowRight") {
            keys_pressed.turn_right = true
        }

        if (event.key === " ") {
            keys_pressed.shooting = true;
            print("yas");
        }
    } else if (player.type == "triangle") {
        if (event.key === "w") {
            keys_pressed.up = true;
        }

        if (event.key === "s") {
            keys_pressed.down = true;
        }

        if (event.key === "a") {
            keys_pressed.turn_left = true;
        }

        if (event.key === "d") {
            keys_pressed.turn_right = true;
        }

        if (event.key === " ") {
            keys_pressed.shooting = true;
            print("yas2");
        }
    }
   
});

addEventListener("keyup", (event) => {
    if (player.type === "square") {
        if (event.key === "w") {
            keys_pressed.up = false;
        } 
    
        if (event.key === "s") {
            keys_pressed.down = false;
        }
    
        if (event.key === "a") {
            keys_pressed.left = false;
        }
    
        if (event.key === "d") {
            keys_pressed.right = false;
        }
    
        if (event.key === "ArrowLeft") {
            keys_pressed.turn_left = false
        }
    
        if (event.key === "ArrowRight") {
            keys_pressed.turn_right = false
        }

        if (event.key === " ") {
            keys_pressed.shooting = false;
        }
    } else if (player.type == "triangle") {
        if (event.key === "w") {
            keys_pressed.up = false;
        }

        if (event.key === "s") {
            keys_pressed.down = false;
        }

        if (event.key === "a") {
            keys_pressed.turn_left = false;
        }

        if (event.key === "d") {
            keys_pressed.turn_right = false;
        }

        if (event.key === " ") {
            keys_pressed.shooting = false;
        }
    }
})