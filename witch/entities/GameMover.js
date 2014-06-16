function MoveState(){}
MoveState.STANDING = 0;
MoveState.RUNNING = 1;
MoveState.JUMPING = 2;
MoveState.FALLING = 3;

function Facing(){}
Facing.LEFT = 0;
Facing.RIGHT = 1;

function GameMover(x, y, lb, tb, rb, bb, img_name, max_run_vel, jump_vel, terminal_vel){
	GameSprite.call(this, x, y, lb, tb, rb, bb, img_name);
	this.type = "GameMover";
	
	this.prev_x = this.x;
	this.prev_y = this.y;
	this.max_run_vel = defaultValue(max_run_vel, 2.0); //pixels/second
	this.gnd_run_acc = this.max_run_vel/3.0;
	this.gnd_run_dec = this.max_run_vel/3.0;
	this.air_run_acc = this.max_run_vel/3.0;
	this.air_run_dec = this.max_run_vel/3.0;
	this.horizontal_input = false;
	this.mult = 0;
	
	this.left_flip_offset = 0;
	this.horizontal_collision = false;
	this.vertical_collision = false;
	this.pressing_down = false;
	this.pressed_down = false;
	this.has_double_jumped = false;
	
	this.vel = {x: 0, y: 0};
	
	this.original_grav_acc = 0.8;
	this.float_grav_acc = 0.4;
	this.grav_acc = this.original_grav_acc;//35.1; //pixels/second
	this.jump_vel = defaultValue(jump_vel, 5.2);
	this.is_jumping = false;
	this.jump_timer = 0;
	this.jump_time_limit = 30;
	this.terminal_vel = defaultValue(terminal_vel, 7.0);
	this.jump_acc = 35.0; 
	this.was_on_ground = true;
	this.on_ground = true;
	this.played_land_sound = true;
	this.previous_bottom = this.y + this.bb;
	
	this.move_state = MoveState.STANDING;
	this.prev_move_state = this.move_state;
	this.facing = Facing.RIGHT;
	this.original_facing = this.facing;
}
extend(GameSprite, GameMover);

GameMover.prototype.Import = function(obj){
	GameSprite.prototype.Import.call(this, obj);
	this.max_run_vel = obj.max_run_vel;
	this.jump_vel = obj.jump_vel;
	this.terminal_vel = obj.terminal_vel;
}
GameMover.prototype.Export = function(){
	var obj = GameSprite.prototype.Export.call(this);
	obj.max_run_vel = this.max_run_vel;
	obj.jump_vel = this.jump_vel;
	obj.terminal_vel = this.terminal_vel;
	return obj;
}

GameMover.prototype.ResetPosition = function(){
	GameObject.prototype.ResetPosition.call(this);
	this.facing = this.original_facing;
}


/** FUNCTION DEFINITIONS****************************************/
/**????????????????????????????????????????????????????????????*/
GameMover.prototype.Update = function(delta, map)
{
	this.ApplyPhysics(delta, map);
	this.prev_x = this.x;
	this.prev_y = this.y;
	if (!this.on_ground){
		if (!this.was_on_ground)
			this.pressed_down = false;
		if (this.vel.y < 0) this.move_state = MoveState.JUMPING;
		else this.move_state = MoveState.FALLING;
	}
	this.UpdateAnimationFromState();
	
	GameSprite.prototype.Update.call(this, delta, map);
}

/*********************PHYSICS AND COLLISION DETECTIONS********************/
GameMover.prototype.ApplyPhysics = function(delta, map)
{
	var prev_pos = {x: this.x, y: this.y};
	
	this.ApplyGravity();
	
	if (!this.horizontal_input) this.MoveStop();
	this.HandleCollisionsAndMove(map);
	this.horizontal_input = false;
	
	if (this.x == prev_pos.x) this.vel.x = 0;
	if (this.y == prev_pos.y) this.vel.y = 0;
	this.previous_bottom = this.y + this.bb;
}

GameMover.prototype.ApplyGravity = function(){
	if (!this.on_ground){
		if (this.vel.y < this.terminal_vel)
		{
			this.vel.y += this.grav_acc;
			if (this.vel.y > this.terminal_vel) 
				this.vel.y = this.terminal_vel;
		}else if (this.vel.y > this.terminal_vel){
			this.vel.y -= this.grav_acc;
			if (this.vel.y < this.terminal_vel)
				this.vel.y = this.terminal_vel;
		}
	}else{ this.vel.y = 0; }
}

GameMover.prototype.HandleCollisionsAndMove = function(map){
	var left_tile = Math.floor((this.x + this.lb + this.vel.x - 1) / Tile.WIDTH);
	var right_tile = Math.ceil((this.x + this.rb + this.vel.x + 1) / Tile.WIDTH);
	var top_tile = Math.floor((this.y + this.tb + this.vel.y - 1) / Tile.HEIGHT);
	var bottom_tile = Math.ceil((this.y + this.bb + this.vel.y + 1) / Tile.HEIGHT);
	
	// Reset flag to search for ground collision.
	this.was_on_ground = this.on_ground;
	this.on_ground = false;
	var q_horz = 3; //q is used to minimize height checked in horizontal collisions and etc.
	var q_vert = 3;
	var floor_tile = null;
	
	floor_tile = this.HandleHorizontalCollisions(map, left_tile, right_tile, top_tile, bottom_tile, q_horz, floor_tile);
	this.x += this.vel.x;
	this.HandleVerticalCollisions(map, left_tile, right_tile, top_tile, bottom_tile, q_vert);
	this.y += this.vel.y;
	if (this.vel.y != 0) this.played_land_sound = false;
	this.CompensateForSlopes(this.was_on_ground, floor_tile);
}

GameMover.prototype.HandleHorizontalCollisions = function(map, left_tile, right_tile, top_tile, bottom_tile, q, floor_tile){
	this.horizontal_collision = false;
	//Check all potentially colliding tiles
	for (var i = top_tile; i <= bottom_tile; i++){
		for (var j = left_tile; j <= right_tile; j++){
			if (!map.isValidTile(i, j)) continue;
			var tile = map.tiles[i][j];
			//don't check for collisions if potential tile is "out of bounds" or not solid
			if (tile.collision != Tile.SOLID) continue;
			
			//Reset floor tile
			if (floor_tile == null || (tile.y > this.y && Math.abs(tile.x-this.x) < Math.abs(floor_tile.x-this.x))){ 
				floor_tile = tile;
			}
			
			//Check for left collisions
			if (this.vel.x < 0 && this.IsRectColliding(tile, this.x + this.lb + this.vel.x - 1, 
			this.y + this.tb + q, this.x + this.lb, this.y + this.bb - q)){
				//this is a negative slope (don't collide left)
				if (tile.l_height < tile.r_height){}
				//okay we're colliding with a solid to our left
				else{
					this.vel.x = 0;
					this.horizontal_collision = true;
					this.x = tile.x + Tile.WIDTH - this.lb;
				}
			}
			
			//Check for Right collisions
			if (this.vel.x > 0 && this.IsRectColliding(tile, this.x + this.rb, this.y + this.tb + q, this.x + this.rb + this.vel.x, this.y + this.bb - q)){
				//this is a positive slope (don't collide right)
				if (tile.r_height < tile.l_height){}
				//okay we're colliding with a solid to our right
				else{
					this.vel.x = 0;
					this.horizontal_collision = true;
					this.x = tile.x - this.rb;
				}
			}
		}
	}
}

GameMover.prototype.HandleVerticalCollisions = function(map, left_tile, right_tile, top_tile, bottom_tile, q){
	//Check all potentially colliding tiles
	for (var i = top_tile; i <= bottom_tile; i++){
		for (var j = left_tile; j <= right_tile; j++){
			if (!map.isValidTile(i, j)) continue;
			var tile = map.tiles[i][j];
			//don't check for collisions if potential tile is "out of bounds" or not solid
			if (tile.collision == Tile.GHOST || tile.collision == Tile.KILL_PLAYER) continue;
			
			//Check for top collisions
			if (this.vel.y < 0 && tile.collision != Tile.FALLTHROUGH && this.IsRectColliding(tile, this.x + this.lb + q, this.y + this.tb + this.vel.y - 1, this.x + this.rb - q, this.y + this.tb)){
				this.vel.y = 0;
				this.y = tile.y + Tile.HEIGHT - this.tb;
			}
			
			//Check for bottom collisions
			if (this.vel.y >= 0 && this.IsRectColliding(tile, this.x + this.lb + q, this.y + this.bb, this.x + this.rb - q, this.y + this.bb + this.vel.y + 1)){
				//Don't count bottom collision for fallthrough platforms if we're not at the top of it
				if (tile.collision == Tile.FALLTHROUGH && (tile.y < this.y + this.bb || this.pressing_down))
					continue;
					
				if (!this.played_land_sound){
					Utils.playSound("land");
					this.played_land_sound = true;
				}
				this.vel.y = 0;
				this.on_ground = true;
				this.has_double_jumped = false;
				this.y = tile.y - this.bb;
			}
		}
	}
}

GameMover.prototype.CompensateForSlopes = function(was_on_ground, floor_tile){
	//if the bottom center of mover is touching the floor
	if (this.vel.y >= 0 && was_on_ground && floor_tile != null && this.IsRectColliding(floor_tile, this.x + this.rb/2 - 2, this.y + this.bb, this.x + this.rb / 2 + 2, this.y + this.bb + 1)){
		if (floor_tile.r_height > floor_tile.l_height){ //negative slope
			y = floor_tile.y + floor_tile.l_height + ((this.x - floor_tile.x) * (floor_tile.r_height - floor_tile.l_height)/Tile.HEIGHT) - this.bb;
			this.y++;
			this.on_ground = true;
		}
		else if (floor_tile.r_height < floor_tile.l_height){ //positive slope
			this.y = floor_tile.y + floor_tile.r_height + ((floor_tile.x - this.x) * (floor_tile.l_height - floor_tile.r_height) / Tile.HEIGHT) - this.bb;
			this.y++;
			this.on_ground = true;
		}
	}
}

/******************RENDER AND ANIMATION FUNCTIONS***********************/
GameMover.prototype.UpdateAnimationFromState = function(){
	switch (this.move_state){
		case MoveState.STANDING:
			if (this.pressing_down)
				this.animation.Change(1, 0, 1);
			else this.animation.Change(0, 0, 1);
			break;
		case MoveState.RUNNING: 
			this.animation.Change(2, 0, 4);
			if (this.prev_move_state == MoveState.FALLING || this.prev_move_state == MoveState.JUMPING)
				this.animation.curr_frame = 1;
			break;
		case MoveState.JUMPING:
			this.animation.Change(0, 1, 2);
			break;
		case MoveState.FALLING:
			this.animation.Change(4, 1, 2);
			break;
		default: break;
	}
	
	if (this.facing == Facing.LEFT){
		this.animation.abs_ani_y = 2 * this.animation.frame_height;
	}else if (this.facing == Facing.RIGHT){
		this.animation.abs_ani_y = 0;
	}
	this.prev_move_state = this.move_state;
}

/*******************FUNCTIONS FOR MOVEMENT INPUT BY OBJECT*****************/
GameMover.prototype.MoveLeft = function(){
	this.facing = Facing.LEFT;
	//if (this.vel.x > 0) this.vel.x = 0;
	this.Move(-1);
}

GameMover.prototype.MoveRight = function(){
	this.facing = Facing.RIGHT;
	//if (this.vel.x < 0) this.vel.x = 0;
	this.Move(1);
}

GameMover.prototype.Move = function(mult){
	this.mult = mult;
	this.pressed_down = false;

	var acc;
	this.horizontal_input = true;
	if ((this.vel.x * mult) < 0) this.vel.x = 0;
	if (this.on_ground){
		acc = this.gnd_run_acc;
		this.move_state = MoveState.RUNNING;
	}
	else{ acc = this.air_run_acc; }
	
	if (Math.abs(this.vel.x) < this.max_run_vel){
		this.vel.x += acc * mult;
		this.CorrectVelocity(mult);
	}
	else if (Math.abs(this.vel.x) > this.max_run_vel){
		this.vel.x -= acc * mult;
		if (Math.abs(this.vel.x) < this.max_run_vel)
			this.vel.x = this.max_run_vel * mult;
	}
	else if (Math.abs(this.vel.x) == this.max_run_vel && this.vel.x != this.max_run_vel * mult){
		this.vel.x += acc * mult;
	}
}

GameMover.prototype.MoveStop = function(){
	this.mult = 0;
	if (this.on_ground){
		if (this.vel.x > 0){
			this.vel.x -= this.gnd_run_dec;
			if (this.vel.x < 0) this.vel.x = 0;
		}else if (this.vel.x < 0){
			this.vel.x += this.gnd_run_dec;
			if (this.vel.x > 0) this.vel.x = 0;
		}
		this.move_state = MoveState.STANDING;
	}else{
		if (this.vel.x > 0){
			this.vel.x -= this.air_run_dec;
			if (this.vel.x < 0) this.vel.x = 0;
		}else if (this.vel.x < 0){
			this.vel.x += this.air_run_dec;
			if (this.vel.x > 0) this.vel.x = 0;
		}
	}
}

GameMover.prototype.CorrectVelocity = function(mult){
	if (Math.abs(this.vel.x) > this.max_run_vel)
		this.vel.x = this.max_run_vel * mult;
}

GameMover.prototype.NudgeLeft = function(gnd_speed, air_speed){
	this.Nudge(-1, gnd_speed, air_speed);
}

GameMover.prototype.NudgeRight = function(gnd_speed, air_speed){	
	this.Nudge(1, gnd_speed, air_speed);
}

GameMover.prototype.Nudge = function(mult, gnd_speed, air_speed){
	if (this.on_ground){
		this.vel.x += gnd_speed * mult;
		this.move_state = MoveState.RUNNING;
	}else{
		this.vel.x += air_speed * mult;
	}
	CorrectVelocity(mult);
}

GameMover.prototype.StartJump = function(){
	if (this.on_ground){
		Utils.playSound("jump");
		this.vel.y = -this.jump_vel;
		this.is_jumping = true;
		this.jump_timer = 0;
		this.on_ground = false;
	}
}

GameMover.prototype.Jump = function(){
	if (this.is_jumping){
		this.jump_timer++;
		if (this.jump_timer >= this.jump_time_limit){
			this.jump_timer = 0;
			this.is_jumping = false;
			this.grav_acc = this.original_grav_acc;
		}else{
			this.grav_acc = this.float_grav_acc;
			this.vel.y += -this.jump_vel * ((this.jump_time_limit - (this.jump_timer/2)) / (this.jump_time_limit * 60));
		}
	}
}

GameMover.prototype.StopJump = function(){
	this.is_jumping = false;
	this.grav_acc = this.original_grav_acc;
}

GameMover.prototype.PressDown = function(){
	this.pressing_down = true;
	this.pressed_down = true;
	this.on_ground = false;
}

GameMover.prototype.StopPressingDown = function(){
	this.pressing_down = false;
}