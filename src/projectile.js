"use strict";

class Projectile {
    constructor(_x, _y, _size, _color, _angle, _speed) {
        this.position = {
            x: _x,
            y: _y
        };

        this.size = _size;

        this.color = _color;

        this.angle = _angle;

        this.speed = _speed;
    }

    update() {
        this.position.x += Math.cos((this.angle - 90) * Math.PI / 180) * this.speed;
        this.position.y += Math.sin((this.angle - 90) * Math.PI / 180) * this.speed;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, false);
    	ctx.fillStyle = this.color;
    	ctx.fill();
    	ctx.closePath();
    }
}
