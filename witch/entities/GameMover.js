function MoveState(){}
MoveState.STANDING = 0;
MoveState.RUNNING = 1;
MoveState.JUMPING = 2;
MoveState.FALLING = 3;

function Facing(){}
Facing.LEFT = 0;
Facing.RIGHT = 1;

//Inheritance
GameMover.prototype = Object.create(GameSprite.prototype);

function GameMover(x, y, lb, tb, rb, bb, image, max_run_vel, jump_vel, terminal_vel){
	GameSprite.call(this, x, y, lb, tb, rb, bb, image);
	this.max_run_vel = defaultValue(max_run_vel, 162.0); //pixels/second
	this.gnd_run_acc = this.max_run_vel/3.0;
	this.gnd_run_dec = this.max_run_vel/10.0;
	this.air_run_acc = this.max_run_vel/4.0;
	this.air_run_dec = this.max_run_vel/100.0;
	this.horizontal_input = false;
	
	this.left_flip_offset = 0;
	this.horizontal_collision = false;
	this.vertical_collision = false;
	
	this.vel = {x: 0, y: 0};
	
	this.grav_acc = 35.1; //pixels/second
	this.jump_vel = defaultValue(jump_vel, 432.0);
	this.terminal_vel = defaultValue(terminal_vel, 316.0);
	this.jump_acc = 35.0; 
	this.on_ground = true;
	this.previous_bottom = this.y + this.bb;
	
	this.move_state = MoveState.STANDING;
	this.facing = Facing.RIGHT;
	
	/** FUNCTION DEFINITIONS****************************************/
	/**????????????????????????????????????????????????????????????*/
	GameMover.prototype.Update = function(delta, map)
	{
		this.ApplyPhysics(delta, map);
		if (!this.on_ground){
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
		
		if (!this.try_move_horz) this.MoveStop();
		this.try_move_horz = false;
		
		this.HandleCollisionsAndMove(map);
		this.JellyWallBounce(map);
		
		if (this.x == prev_pos.x) this.vel.x = 0;
		if (this.y == prev_pos.y) this.vel.y = 0;
		this.previous_bottom = this.y + this.bb;
	}

	GameMover.prototype.HandleCollisionsAndMove = function(map){
		var left_tile = Math.floor((this.lb*1.0) / Tile.WIDTH);
		var right_tile = Math.ceil((this.rb*1.0) / Tile.WIDTH) - 1;
		var top_tile = Math.floor((this.tb*1.0) / Tile.HEIGHT);
		var bottom_tile = Math.ceil((this.bb*1.0) / Tile.HEIGHT) - 1;
		
		// Reset flag to search for ground collision.
		var was_on_ground = this.on_ground;
		this.on_ground = false;
		var q_horz = 3; //q is used to minimize height checked in horizontal collisions and etc.
		var q_vert = 3;
		var floor_tile = null;
		
		floor_tile = this.HandleHorizontalCollisions(map, left_tile, right_tile, top_tile, bottom_tile, q_horz, floor_tile);
		this.x += this.vel.x;
		this.HandleVerticalCollisions(map, left_tile, right_tile, top_tile, bottom_tile, q_vert);
		this.y += this.vel.y;
		this.CompensateForSlopes(was_on_ground, floor_tile);
	}

	GameMover.prototype.HandleHorizontalCollisions = function(map, left_tile, right_tile, top_tile, bottom_tile, q, floor_tile){
		this.horizontal_collision = false;
		//Check all potentially colliding tiles
		for (var i = top_tile; i <= bottom_tile; i++){
			for (var j = left_tile; j <= right_tile; j++){
				if (!isValidTile(i, j, map)) continue;
				var tile = map.tiles[i][j];
				//don't check for collisions if potential tile is "out of bounds" or not solid
				if (!tile.solid || tile.fallthrough) continue;
				
				//Reset floor tile
				if (floor_tile == null || (tile.y > this.y && Math.abs(tile.x-this.x) < Math.abs(floor_tile.x-this.x))){ 
					floor_tile = tile;
				}
				
				//Check for left collisions
				if (this.vel.x < 0 && this.IsRectColliding(tile, this.x + this.lb - this.vel.x - 1, 
				this.y + this.tb, + q, this.x + this.lb, this.y + this.bb - q)){
					//this is a negative slope (don't collide left)
					if (tile.l_height < tile.r_height){}
					//okay we're colliding with a solid to our left
					else{
						this.vel.x = 0;
						this.horizontal_collision = true;
						this.x = ~~(this.x); //force your x to be an int (no sneaking past walls)
						while (!IsRectColliding(tile, this.x + this.lb - 1, this.y + this.tb + q, this.x + this.lb, this.y + this.bb - q)){
							this.x--; 
						}
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
						this.x = ~~(this.x);
						while (!IsRectColliding(tile, this.x + this.rb, this.y + this.tb + q, this.x + this.rb + 1, this.y + this.bb - q)){
							this.x++;
						}
					}
				}
			}
		}
	}

	GameMover.prototype.HandleVerticalCollisions = function(map, left_tile, right_tile, top_tile, bottom_tile, q){
		//Check all potentially colliding tiles
		for (var i = top_tile; i <= bottom_tile; i++){
			for (var j = left_tile; j <= right_tile; j++){
				if (!isValidTile(i, j, map)) continue;
				var tile = map.tiles[i][j];
				//don't check for collisions if potential tile is "out of bounds" or not solid
				if (!tile.solid) continue;
				
				//Check for top collisions
				if (this.vel.y < 0 && this.IsRectColliding(tile, this.x + this.lb + q, thi.sy + this.tb - this.vel.y - 1, this.x + this.rb - this.q, this.y + this.tb)){
					//this is a negative slope (don't collide left)
					if (tile.l_height < tile.r_height){}
					//okay we're colliding with a solid to our left
					else{
						this.vel.y = 0;
						y = ~~(y)+1;
						while (!this.IsRectColliding(tile, this.x + this.lb + q, this.y + this.tb - 1, this.x + this.rb - q, this.y + this.tb)){
							this.y--; 
						}
					}
				}
				
				//Check for bottom collisions
				if (this.vel.y >= 0 && this.IsRectColliding(tile, this.x + this.lb + q, this.y + this.bb, this.x + this.rb - q, this.y + this.bb + this.vel.y + 1)){
					//Don't count bottom collision for fallthrough platforms if we're not at the top of it
					if (!tile.fallthrough || tile.y + 4 < this.y + this.bb + 1){
						this.vel.y = 0;
						this.on_ground = true;
						this.y = ~~(this.y) - 1;
						while (!this.IsRectColliding(tile, this.x + this.lb + q, this.y + this.bb, this.x + this.rb - q, this.y + this.bb + 1)){
							this.y++;
						}
					}
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

	GameMover.prototype.JellyWallBounce = function(map){
		var left_tile = Math.floor((this.lb*1.0) / Tile.WIDTH);
		var right_tile = Math.ceil((this.rb*1.0) / Tile.WIDTH) - 1;
		var top_tile = Math.floor((this.tb*1.0) / Tile.HEIGHT);
		var bottom_tile = Math.ceil((this.bb*1.0) / Tile.HEIGHT) - 1;
		
		for (var i = top_tile; i <= bottom_tile; i++){
			for (var j = left_tile; j <= right_tile; j++){
				if (!isValidTile(i, j, map)) continue;
				var tile = map.tiles[i][j];
				if (!tile.solid || tile.slope === Slope.FLAT)
					continue;
					
				if (this.IsRectColliding(tile, this.x + this.lb, this.y + this.bb/2 - 1, this.x + this.rb, this.y + this.bb/2)){
					if (tile.x + Tile.WIDTH/2 < this.x + this.lb)
						this.x++;
					else if (tile.x > this.x + this.rb)
						this.x--;
				}
			}
		}
	}

	/******************RENDER AND ANIMATION FUNCTIONS***********************/
	GameMover.prototype.UpdateAnimationFromState = function(){}

	GameMover.prototype.Render = function(ctx){
		ctx.save();
		if (this.facing === Facing.LEFT){
			ctx.scale(-1, 1);
		}
		GameSprite.prototype.Render.call(this, ctx);
		ctx.restore();
	}

	/*******************FUNCTIONS FOR MOVEMENT INPUT BY OBJECT*****************/
	GameMover.prototype.Jump = function(){
		if (this.on_ground){
			this.vel.y = -this.jump_vel;
		}
	}

	GameMover.prototype.MoveLeft = function(){
		this.facing = Facing.LEFT;
		this.Move(-1);
	}

	GameMover.prototype.MoveRight = function(){
		this.facing = Facing.RIGHT;
		this.Move(1);
	}

	GameMover.prototype.Move = function(mult){
		this.horizontal_input = true;
		if (this.on_ground){
			if (this.vel.x * mult < 0) this.vel.x = 0;
			if (Math.abs(this.vel.x) < this.max_run_vel){
				this.vel.x += this.gnd_run_acc * mult;
				CorrectVelocity(mult);
			}
			else if (Math.abs(this.vel.x) > this.max_run_vel){
				this.vel.x -= this.gnd_run_acc * mult;
				if (Math.abs(this.vel.x) < this.max_run_vel)
					this.vel.x = this.max_run_vel * mult;
			}
			this.move_state = MoveState.RUNNING;
		}
		else
		{
			if (Math.abs(this.vel.x) < this.max_run_vel){
				if (this.move_state === MoveState.JUMPING)
					this.vel.x = this.max_run_vel * mult;
				else this.vel.x += this.air_run_acc * mult;
				CorrectVelocity(mult);
			}
		}
	}

	GameMover.prototype.MoveStop = function(){
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
				if (this.vel.x > 0) vel.x = 0;
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
}



