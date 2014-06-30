function Enemy(x, y, enemy_id){
	GameMover.call(this, x, y, 2, 2, 14, 16, "enemy_sheet");
	
	this.type = "Enemy";
	this.kill_player = true;
	this.enemy_id = enemy_id;
	
	this.facing = Facing.LEFT;
	this.original_facing = this.facing;
	this.max_run_vel = 1.5;
	
	this.GlitchMe();
}
Enemy.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
	this.enemy_id = obj.enemy_id;
	
	this.GlitchMe();
}

Enemy.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.enemy_id = this.enemy_id;
	return obj;
}
extend(GameMover, Enemy);

Enemy.prototype.GlitchMe = function(){
	if (this.enemy_id === 1){
		this.ApplyGravity = function(){}
		this.HandleHorizontalCollisions = function(){};
		this.HandleVerticalCollisions = function(){};
	}
}

Enemy.prototype.Update = function(delta, map){
	if (this.facing == Facing.LEFT){
		this.vel.x = -this.max_run_vel;
	}
	else{
		this.vel.x = this.max_run_vel;
	}
	GameMover.prototype.Update.call(this, delta, map);
	
	if (this.horizontal_collision){
		if (this.facing == Facing.LEFT) 
			this.facing = Facing.RIGHT;
		else this.facing = Facing.LEFT;
	}
	if (this.enemy_id === 1){
		if (this.x < 0){ this.facing = Facing.RIGHT;}
		if (this.x + this.rb > map.MAP_WIDTH * Tile.WIDTH){ this.facing = Facing.LEFT; }
	}
	
	if (this.enemy_id === null || this.enemy_id === undefined){
		this.delete_me = true;
	}
}

Enemy.prototype.UpdateAnimationFromState = function(){
	var ani_x = 0;
	var ani_y = this.enemy_id;
	this.animation.Change(ani_x, ani_y, 6);
	
	if (this.facing === Facing.LEFT){
		this.animation.abs_ani_y = 2 * this.animation.frame_height;
	}else if (this.facing === Facing.RIGHT){
		this.animation.abs_ani_y = 0;
	}
	this.prev_move_state = this.move_state;
}