"use strict";

class Void {
    constructor(_inside_size, _thickness, _color) {
        this.inside_size = _inside_size;
        this.thickness = _thickness;

        this.color = _color;

        }

    render(ctx) {
        ctx.fillStyle = this.color;

        ctx.fillRect(-this.inside_size / 2, -this.inside_size / 2, this.inside_size, this.thickness);
        ctx.fillRect(-this.inside_size / 2, -this.inside_size / 2, this.thickness, this.inside_size);
        ctx.fillRect(-this.inside_size / 2, this.inside_size / 2, this.inside_size * 2, this.thickness);
        ctx.fillRect(this.inside_size / 2, -this.inside_size / 2, this.thickness, this.inside_size);
        
    }

    check_collision(player) {
        if (player.position.x - player.size < (-this.inside_size / 2) + this.thickness) return true;
        else if (player.position.x + player.size > (this.inside_size / 2)) return true;

        if (player.position.y - player.size < (-this.inside_size / 2) + this.thickness) return true;
        else if (player.position.y + player.size > (this.inside_size / 2)) return true;
    }
}