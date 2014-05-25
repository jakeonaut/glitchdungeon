function GameSprite(x, y, lb, tb, rb, bb, img_name){
	GameObject.call(this, x, y, lb, tb, rb, bb);
	this.img_name = img_name;
	this.image = eval("resource_manager." + this.img_name);
	this.animation = new Animation(1, 8);
	this.base_ani_x = 0;
	this.base_ani_y = 0;
	this.visible = true;
}
extend(GameObject, GameSprite);

GameSprite.prototype.Import = function(obj){
	GameObject.prototype.Import.call(this, obj);
	this.img_name = obj.img_name;
	this.image = eval("resource_manager." + this.img_name);
}
GameSprite.prototype.Export = function(){
	var obj = GameObject.prototype.Export.call(this);
	obj.img_name = this.img_name;
	return obj;
}

/** FUNCTION DEFINITIONS****************************************/
/**????????????????????????????????????????????????????????????*/
GameSprite.prototype.Update = function(delta, map){
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