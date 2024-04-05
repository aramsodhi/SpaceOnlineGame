"use strict";

class Player {
    constructor(_x, _y,) {
        this.position = {
            x: _x,
            y: _y
        };

        this.angle = 0;

        this.x_vel = 0;
        this.y_vel = 0;

        this.projectiles = [];

        this.shooting_interval;
    }
}

class Square extends Player {
    constructor(_x, _y, _size) {
        super(_x, _y,);

        this.color = "tomato";

        this.size = _size;

        this.max_speed = 13;
        this.acceleration = 0.27;
        this.turning_speed = 5;
        this.damage = 5;
        this.friction = 0.985;

        this.shooting_speed = 5;
        this.shooting_size = 6;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.position.x + (this.size / 2), this.position.y + (this.size / 2));
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.translate(-(this.position.x + (this.size / 2)), -(this.position.y + (this.size / 2)));
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
        ctx.restore();
    }

    update(keys_pressed, _void) {
        if (keys_pressed.turn_left) this.angle -= this.turning_speed;
        else if (keys_pressed.turn_right) this.angle += this.turning_speed;

        if (keys_pressed.up) {
            this.y_vel -= this.acceleration;
        }

        if (keys_pressed.down) {
            this.y_vel += this.acceleration;
        }

        if (keys_pressed.left) {
            this.x_vel -= this.acceleration;
        }
    
        if (keys_pressed.right) {
            this.x_vel += this.acceleration;
        }

        if (this.x_vel > this.max_speed) this.x_vel = this.max_speed;
        else if (this.x_vel < -this.max_speed) this.x_vel = -this.max_speed;

        if (this.y_vel > this.max_speed) this.y_vel = this.max_speed;
        else if (this.y_vel < -this.max_speed) this.y_vel = -this.max_speed;

        this.x_vel *= this.friction;
        this.y_vel *= this.friction;

        this.position.x += this.x_vel;
        this.position.y += this.y_vel;

        if (this.position.x - 30 < (-_void.inside_size / 2) + _void.thickness) {
            this.x_vel *= -1;
        } else if (this.position.x + this.size + 30 > (_void.inside_size / 2)) {
            this.x_vel *= -1;
        }

        if (this.position.y - 30 < (-_void.inside_size / 2) + _void.thickness) {
            this.y_vel *= -1;
        } else if (this.position.y + this.size + 30 > (_void.inside_size / 2)) {
            this.y_vel *= -1;
        }
    }
}

class Triangle extends Player {
    constructor(_x, _y, _size) {
        super(_x, _y);

        this.color = "limegreen"

        this.size = _size;
        this.stretch = 1.45;
        
        this.max_speed = 25;
        this.acceleration = 0.5;
        this.deceleration = 0.3;
        this.turning_speed = 6;
        this.damage = 3;
        this.friction = 0.95;

        this.shooting_speed = 14;
        this.shooting_size = 3;
    }

    calculate_verticies() {
        const vertex_1 = [this.position.x, this.position.y];
        const vertex_2 = [this.position.x + (this.size / 2), this.position.y + this.stretch * this.size];
        const vertex_3 = [this.position.x - (this.size / 2), this.position.y + this.stretch * this.size];

        return [vertex_1, vertex_2, vertex_3];
    }

    calculate_centroid() {
        const verticies = this.calculate_verticies();

        const centroid_x = (verticies[0][0] + verticies[1][0] + verticies[2][0]) / 3;
        const centroid_y = (verticies[0][1] + verticies[1][1] + verticies[2][1]) / 3;

        return [centroid_x, centroid_y];
    }

    render(ctx) {
        const verticies = this.calculate_verticies();
        const centroid = this.calculate_centroid();
    
        ctx.save();
        ctx.translate(centroid[0], centroid[1]);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.translate(-centroid[0], -centroid[1]);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(verticies[0][0], verticies[0][1]);
        ctx.lineTo(verticies[1][0], verticies[1][1]);
        ctx.lineTo(verticies[2][0], verticies[2][1]);
        ctx.fill();
        ctx.restore();
    }

    update(keys_pressed, _void) {
        if (keys_pressed.turn_left) this.angle -= this.turning_speed;
        else if (keys_pressed.turn_right) this.angle += this.turning_speed;

        if (keys_pressed.up) {
            console.log("moving forward");
            this.x_vel += Math.cos((this.angle - 90) * Math.PI / 180) * this.acceleration;
            this.y_vel += Math.sin((this.angle - 90) * Math.PI / 180) * this.acceleration;
        }

        if (keys_pressed.down) {
            this.x_vel -= Math.cos((this.angle - 90) * Math.PI / 180) * this.deceleration;
            this.y_vel -= Math.sin((this.angle - 90) * Math.PI / 180) * this.deceleration;
        }

        if (this.x_vel > this.max_speed) this.x_vel = this.max_speed;
        else if (this.x_vel < -this.max_speed) this.x_vel = -this.triangle_max_speed;

        if (this.y_vel > this.triangle_max_speed) this.y_vel = this.max_speed;
        else if (this.y_vel < -this.max_speed) this.y_vel = -this.max_speed;

        this.x_vel *= this.friction;
        this.y_vel *= this.friction;

        this.position.x += this.x_vel;
        this.position.y += this.y_vel;

        if (this.position.x - 30 < (-_void.inside_size / 2) + _void.thickness) {
            this.x_vel *= -1;
        } else if (this.position.x + this.size + 30 > (_void.inside_size / 2)) {
            this.x_vel *= -1;
        }

        if (this.position.y - 30 < (-_void.inside_size / 2) + _void.thickness) {
            this.y_vel *= -1;
        } else if (this.position.y + this.size + 30 > (_void.inside_size / 2)) {
            this.y_vel *= -1;
        }
    }
}


class Diamond extends Player {
    constructor(_x, _y, _size) {
        super(_x, _y);

        this.color = "dodgerblue";

        this.size = _size;
        this.stretch = 1.7;
        
        this.max_speed = 35;
        this.acceleration = 0.6;
        this.deceleration = 0.6;
        this.turning_speed = 2;
        this.damage = 3;
        this.friction = 0.93;

        this.shooting_speed = 8;
        this.shooting_size = 7;   
    }

    calculate_verticies() {
        const vertex_1 = [this.position.x, this.position.y];
        const vertex_2 = [this.position.x + (this.size / 2), this.position.y + this.stretch * this.size];
        const vertex_3 = [this.position.x, this.position.y + 2 * this.stretch * this.size];
        const vertex_4 = [this.position.x - (this.size / 2), this.position.y + this.stretch * this.size];

        return [vertex_1, vertex_2, vertex_3, vertex_4];
    }

    calculate_centroid() {
        const verticies = this.calculate_verticies();

        const centroid_x = (verticies[0][0] + verticies[1][0] + verticies[2][0] + verticies[3][0]) / 4;
        const centroid_y = (verticies[0][1] + verticies[1][1] + verticies[2][1] + verticies[3][1]) / 4;

        return [centroid_x, centroid_y];
    }

    render(ctx) {
        const verticies = this.calculate_verticies();
        const centroid = this.calculate_centroid();

        ctx.save();
        ctx.translate(centroid[0], centroid[1]);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.translate(-centroid[0], -centroid[1]);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(verticies[0][0], verticies[0][1]);
        ctx.lineTo(verticies[1][0], verticies[1][1]);
        ctx.lineTo(verticies[2][0], verticies[2][1]);
        ctx.lineTo(verticies[3][0], verticies[3][1]);
        ctx.fill();
        ctx.restore();
    }

    update(keys_pressed) {
        if (keys_pressed.turn_left) this.angle -= this.turning_speed;
        else if (keys_pressed.turn_right) this.angle += this.turning_speed;

        if (keys_pressed.up) {
            this.x_vel += Math.cos((this.angle - 90) * Math.PI / 180) * this.acceleration;
            this.y_vel += Math.sin((this.angle - 90) * Math.PI / 180) * this.acceleration;
        }

        if (keys_pressed.down) {
            this.x_vel -= Math.cos((this.angle - 90) * Math.PI / 180) * this.deceleration;
            this.y_vel -= Math.sin((this.angle - 90) * Math.PI / 180) * this.deceleration;
        }

        if (this.x_vel > this.max_speed) this.x_vel = this.max_speed;
        else if (this.x_vel < -this.max_speed) this.x_vel = -this.max_speed;

        if (this.y_vel > this.max_speed) this.y_vel = this.max_speed;
        else if (this.y_vel < -this.max_speed) this.y_vel = -this.max_speed;

        this.x_vel *= this.friction;
        this.y_vel *= this.friction;

        this.position.x += this.x_vel;
        this.position.y += this.y_vel;

        if (this.position.x - 30 < (-_void.inside_size / 2) + _void.thickness) {
            this.x_vel *= -1;
        } else if (this.position.x + this.size + 30 > (_void.inside_size / 2)) {
            this.x_vel *= -1;
        }

        if (this.position.y - 30 < (-_void.inside_size / 2) + _void.thickness) {
            this.y_vel *= -1;
        } else if (this.position.y + this.size + 30 > (_void.inside_size / 2)) {
            this.y_vel *= -1;
        }
    }
}
