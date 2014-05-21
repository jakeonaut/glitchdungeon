//Inheritance
GameSprite.prototype = Object.create(GameObject.prototype);

function GameSprite(x, y, lb, tb, rb, bb, image){
	GameObject.call(this, x, y, lb, tb, rb, bb);
	this.image = image;
	this.animation = new Animation(1, 0);
	this.base_ani_x = 0;
	this.base_ani_y = 0;
	this.visible = true;
}

/** FUNCTION DEFINITIONS****************************************/
/**????????????????????????????????????????????????????????????*/
GameSprite.prototype.Update = function(delta, map)
{
	this.animation.Update(delta);
	GameObject.prototype.Update.call(this, delta, map);
}

GameSprite.prototype.Render = function(ctx){	
	if (this.image === null || !this.visible) return;
	var ani = this.animation;
	var row = ani.rel_ani_y;
	var column = ani.rel_ani_x + ani.curr_frame;
	
	ctx.drawImage(this.image, 
		//SOURCE RECTANGLE
		ani.frame_width * column + ani.abs_ani_x + this.base_ani_x,
		ani.frame_height * row + ani.abs_ani_y + this.base_ani_y,
		ani.frame_width, ani.frame_height,
		//DESTINATION RECTANGLE
		~~(this.x+0.5) + ani.x_offset, ~~(this.y+0.5)+ani.y_offset,
		ani.frame_width, ani.frame_height
	);
}