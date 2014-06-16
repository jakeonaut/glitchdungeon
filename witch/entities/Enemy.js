function Enemy(x, y, enemy_id){
	GameMover.call(this, x, y, 2, 2, 14, 16, "enemy_sheet");
	
	this.type = "Enemy";
	this.kill_player = true;
	this.enemy_id = enemy_id;
	
	this.facing = Facing.LEFT;
	this.original_facing = this.facing;
	this.max_run_vel = 1.5;
}
Enemy.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
	this.enemy_id = obj.enemy_id;
}

Enemy.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.enemy_id = this.enemy_id;
	return obj;
}
extend(GameMover, Enemy);

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
}

Enemy.prototype.UpdateAnimationFromState = function(){
	var ani_x = this.enemy_id / 2;
	var ani_y = this.enemy_id % 2;
	this.animation.Change(ani_x, ani_y, 2);
	
	if (this.facing === Facing.LEFT){
		this.animation.abs_ani_y = 2 * this.animation.frame_height;
	}else if (this.facing === Facing.RIGHT){
		this.animation.abs_ani_y = 0;
	}
	this.prev_move_state = this.move_state;
}