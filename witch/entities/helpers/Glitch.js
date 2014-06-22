Glitch.GREY = 0;
Glitch.RED = 1;
Glitch.GREEN = 2;
Glitch.ZERO = 3;
Glitch.BLUE = 4;
//Glitch.CYAN = 4;
Glitch.GOLD = 5;

function Glitch(){};

Glitch.TransformPlayer = function(map, glitch_type){
	if (room_manager) room_manager.glitch_type = glitch_type;
	
	//Normalize the player before transforming
	var facing = map.player.facing;
	var vel = map.player.vel;
	var is_jumping = map.player.is_jumping;
	var jump_timer = map.player.jump_timer;
	var jump_time_limit = map.player.jump_time_limit;
	var on_ground = map.player.on_ground;
	map.player = new Player(map.player.x, map.player.y);
	map.player.facing = facing;
	map.player.vel = vel;
	map.player.is_jumping = is_jumping;
	map.player.jump_timer = jump_timer;
	map.player.jump_time_limit = jump_time_limit;
	map.player.on_ground = on_ground;
	if (map.player.is_jumping)
		map.player.grav_acc = map.player.float_grav_acc;
	//map.player.grav_acc = grav_acc;
	if (map.glitch_type != Glitch.RED){
		map.player.on_ground = false;
	}
	map.player.was_on_ground = true;

	map.tilesheet_name = "tile_grey_sheet";
	

	var oldbb = map.player.bb;
	switch (glitch_type){
		case Glitch.GREY:
			break;
		case Glitch.RED:
			Glitch.RedTransform(map, map.player);
			break;
		case Glitch.GREEN:
			Glitch.GreenTransform(map, map.player);
			break;
		case Glitch.BLUE:
			Glitch.BlueTransform(map, map.player);
			break;
		/*case Glitch.CYAN:
			Glitch.CyanTransform(map, map.player);
			break;*/
		case Glitch.GOLD:
			Glitch.GoldTransform(map, map.player);
			break;
		case Glitch.ZERO:
			Glitch.ZeroTransform(map, map.player);
			break;
		default: break;
	}

	map.player.y += oldbb - map.player.bb;
	map.player.image = eval("resource_manager." + map.player.img_name);
}
extend(GameSprite, Glitch);

//******GLITCH TRANSFORMATION DEFINTIIONS***************************/
Glitch.RedTransform = function(map, player){
	player.img_name = "player_red_sheet";
	map.tilesheet_name = "tile_red_sheet";
			
	player.HandleCollisionsAndMove = function(map){
		var left_tile = Math.floor((this.x + this.lb + this.vel.x) / Tile.WIDTH);
		var right_tile = Math.ceil((this.x + this.rb + this.vel.x) / Tile.WIDTH);
		var top_tile = Math.floor((this.y + this.tb + this.vel.y) / Tile.HEIGHT);
		var bottom_tile = Math.ceil((this.y + this.bb + this.vel.y) / Tile.HEIGHT);
		
		// Reset flag to search for ground collision.
		this.was_on_ground = this.on_ground;
		//this.on_ground = false;
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
}

Glitch.GreenTransform = function(map, player){
	player.img_name = "player_green_sheet";
	map.tilesheet_name = "tile_green_sheet";
	
	player.gnd_run_acc = player.max_run_vel/10.0;
	player.gnd_run_dec = player.max_run_vel/100.0;
	player.air_run_acc = player.max_run_vel/10.0;
	player.air_run_dec = player.max_run_vel/100.0;
	
	player.terminal_vel = 1.0;
	player.original_grav_acc = 0.2;
	player.float_grav_acc = 0.2;
	player.grav_acc = player.original_grav_acc;
	player.jump_time_limit = 60;
	player.jump_vel = 3.3;
	
	player.Move = function(mult){
		this.mult = mult;
		this.pressed_down = false;

		var acc;
		this.horizontal_input = true;
		//if ((this.vel.x * mult) < 0) this.vel.x = 0;
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
		}else if (Math.abs(this.vel.x) == this.max_run_vel && this.vel.x != this.max_run_vel * mult){
			this.vel.x += acc * mult;
		}
	}
}

Glitch.ZeroTransform = function(map, player){
	player.img_name = "player_zero_sheet";
	map.tilesheet_name = "tile_zero_sheet";
	
	player.DieToSpikesAndStuff = function(){}
	
	player.Render = function(ctx, camera){
		ctx.globalCompositeOperation = "lighter";
		GameMover.prototype.Render.call(this, ctx, camera);
		ctx.globalCompositeOperation = "source-over";
	}
}

Glitch.BlueTransform = function(map, player){
	player.img_name = "player_blue_sheet";
	map.tilesheet_name = "tile_blue_sheet";
	
	player.tb = 0;
	player.bb = 14;
	
	player.ApplyGravity = function(delta, map)
	{
		if (!this.on_ground){
			if (this.vel.y > -this.terminal_vel)
			{
				this.vel.y -= this.grav_acc;
				if (this.vel.y < -this.terminal_vel) 
					this.vel.y = -this.terminal_vel;
			}else if (this.vel.y < -this.terminal_vel){
				this.vel.y += this.grav_acc;
				if (this.vel.y > -this.terminal_vel)
					this.vel.y = -this.terminal_vel;
			}
		}else{ this.vel.y = 0; }
	}
		
	player.HandleVerticalCollisions = function(map, left_tile, right_tile, top_tile, bottom_tile, q){
		//Check all potentially colliding tiles
		for (var i = top_tile; i <= bottom_tile; i++){
			for (var j = left_tile; j <= right_tile; j++){
				if (!map.isValidTile(i, j)) continue;
				var tile = map.tiles[i][j];
				//don't check for collisions if potential tile is "out of bounds" or not solid
				if (tile.collision == Tile.GHOST || tile.collision == Tile.KILL_PLAYER) continue;
				
				//Check for top collisions
				if (this.vel.y <= 0 && this.IsRectColliding(tile, this.x + this.lb + q, this.y + this.tb + this.vel.y - 1, this.x + this.rb - q, this.y + this.tb)){
					//Don't count bottom collision for fallthrough platforms if we're not at the top of it
					if (tile.collision == Tile.FALLTHROUGH && (tile.y + Tile.HEIGHT > this.y || this.pressing_down))
						continue;
				
					this.vel.y = 0;
					this.y = tile.y + Tile.HEIGHT - this.tb;
					
					if (!this.played_land_sound){
						Utils.playSound("land");
						this.played_land_sound = true;
					}
					this.on_ground = true;
					this.has_double_jumped = false;
				}
				
				//Check for bottom collisions
				if (this.vel.y > 0 && tile.collision != Tile.FALLTHROUGH && this.IsRectColliding(tile, this.x + this.lb + q, this.y + this.bb, this.x + this.rb - q, this.y + this.bb + this.vel.y + 1)){
					this.vel.y = 0;
					this.y = tile.y - this.bb;
				}
			}
		}
	}
	
	
	player.StartJump = function(){
		if (this.on_ground){
			Utils.playSound("jump");
			this.vel.y = this.jump_vel;
			this.is_jumping = true;
			this.jump_timer = 0;
			this.on_ground = false;
		}
	}

	player.Jump = function(){
		if (this.is_jumping){
			this.jump_timer++;
			if (this.jump_timer >= this.jump_time_limit){
				this.jump_timer = 0;
				this.is_jumping = false;
				this.grav_acc = this.original_grav_acc;
			}else{
				this.grav_acc = this.float_grav_acc;
				this.vel.y += this.jump_vel * ((this.jump_time_limit - (this.jump_timer/2)) / (this.jump_time_limit * 60));
			}
		}
	}
}

Glitch.GoldTransform = function(map, player){
	player.img_name = "player_gold_sheet";
	map.tilesheet_name = "tile_gold_sheet";
	
	player.HandleCollisionsAndMove = function(map){
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
		if (this.horizontal_collision && this.horizontal_input){
			this.vel.y = -1;
			this.move_state = MoveState.RUNNING;
		}
		this.HandleVerticalCollisions(map, left_tile, right_tile, top_tile, bottom_tile, q_vert);
		this.y += this.vel.y;
		if (this.vel.y != 0) this.played_land_sound = false;
		this.CompensateForSlopes(this.was_on_ground, floor_tile);
	}
	
	player.Update = function(delta, map)
	{
		this.ApplyPhysics(delta, map);
		this.prev_x = this.x;
		this.prev_y = this.y;
		if (!this.on_ground){
			if (!this.was_on_ground)
				this.pressed_down = false;
			if (!this.horizontal_collision){
				if (this.vel.y < 0) this.move_state = MoveState.JUMPING;
				else this.move_state = MoveState.FALLING;
			}
		}
		this.UpdateAnimationFromState();
		GameSprite.prototype.Update.call(this, delta, map);
	}
}

/*Glitch.ZeroTransform = function(map, player){
	player.img_name = "player_zero_sheet";
	map.tilesheet_name = "tile_zero_sheet";
		
	player.HandleHorizontalCollisions = function(map, left_tile, right_tile, top_tile, bottom_tile, q, floor_tile){
		this.horizontal_collision = false;
	}

	player.HandleVerticalCollisions = function(map, left_tile, right_tile, top_tile, bottom_tile, q){
		//Check all potentially colliding tiles
		for (var i = top_tile; i <= bottom_tile; i++){
			for (var j = left_tile; j <= right_tile; j++){
				if (!map.isValidTile(i, j)) continue;
				var tile = map.tiles[i][j];
				//don't check for collisions if potential tile is "out of bounds" or not solid
				if (tile.collision == Tile.GHOST) continue;
					
				//Check for bottom collisions
				if (this.vel.y >= 0 && this.IsRectColliding(tile, this.x + this.lb + q, this.y + this.bb, this.x + this.rb - q, this.y + this.bb + this.vel.y + 1)){
					//Don't count bottom collision for fallthrough platforms if we're not at the top of it
					if (tile.y < this.y + this.bb || (this.pressing_down && !this.touching_door))
						continue;
					this.vel.y = 0;
					
					if (!this.played_land_sound){
						Utils.playSound("land");
						this.played_land_sound = true;
					}
					this.on_ground = true;
					this.has_double_jumped = false;
					this.y = tile.y - this.bb;
				}
			}
		}
	}
}*/