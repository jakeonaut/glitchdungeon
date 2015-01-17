function House(callback){
	this.path = "witch/rooms/rooms/room_";
	this.num_deaths = 0;
	this.spells_cast = 0;
	this.then = Date.now();
	this.time = 0;
	this.beat_game = false;
	this.submitted = false;

	this.num_artifacts = 0;
	this.has_spellbook = false;
	this.spellbook = [];
	this.glitch_type = Glitch.GREY;
	this.glitch_index = -1;

	this.room_index_x = 0;
	this.room_index_y = 0;
	this.old_room_index_x = 0;
	this.old_room_index_y = 0;
	
	this.house_width = 6;
	this.house_height = 6;
	this.rooms_loaded = 0;
	this.room_load_queue = [];
	this.SetUpRooms();
	
	//SET UP GLITCHED ROOMS
	var self = this;
	this.glitched_rooms = [];
	for (var i = 0; i < this.house_height; i++){
		var row = [];
		for (var j = 0; j < this.house_width; j++){
			row.push([]);
		}
		this.glitched_rooms.push(row);
	}
	var setupGlitchedRoom = function(i, j){
		self.room_load_queue.push([i, j, true]);
		Room.ImportAsync(self.path + j + "_" + i + "_glitched.txt", function(room){
			self.glitched_rooms[i][j] = room;
		});
	}
	setupGlitchedRoom(0, 1);
	setupGlitchedRoom(0, 0);
	setupGlitchedRoom(5, 0);
	setupGlitchedRoom(4, 3);
	setupGlitchedRoom(3, 3);
	setupGlitchedRoom(2, 2);
	
	setTimeout(function(){this.LoadNextRoom(callback);}.bind(this), 0);
}

House.prototype.LoadNextRoom = function(callback){	
	var room_q = this.room_load_queue.splice(0, 1)[0];
	//console.log(room_q);
	var i = room_q[0];
	var j = room_q[1];
	var glitched = room_q[2];
	var filename = this.path + j + "_" + i;
	if (glitched) filename += "_glitched";
	filename += ".txt";
	
	self = this;
	
	Room.ImportAsync(filename, function(room){
		if (!glitched){
			self.rooms[i][j] = room;
			self.rooms_loaded++;
		}
		else self.glitched_rooms[i][j] = room;
		
		if (!glitched && self.rooms_loaded >= self.house_height * self.house_width){
			console.log("done loading");
			self.FinishedLoading(callback);
		}
		
		if (self.room_load_queue.length > 0){
			setTimeout(function(){
				self.LoadNextRoom(callback);
			}.bind(self), 0);
		}
	});
}

House.prototype.SetUpRooms = function(){
	this.rooms = [];
	for (var i = 0; i < this.house_height; i++){
		var row = [];
		for (var j = 0; j < this.house_width; j++){
			row.push([]);
		}
		this.rooms.push(row);
	}
	
	for (var i = 0; i < this.house_height; i++){
		for (var j = 0; j < this.house_width; j++){
			this.room_load_queue.push([i, j, false]);
		}
	}
	//this.rooms[99][99] = Room.Import(path + "99_99.txt");
}

House.prototype.FinishedLoading = function(callback){
	this.rooms[2][4].entities.push(new Collection(11*Tile.WIDTH, 3*Tile.HEIGHT, 6));
	this.old_rooms = [];
	for (var i = 0; i < this.rooms.length; i++){
		var row = [];
		for (var j = 0; j < this.rooms[i].length; j++){
			row.push(this.rooms[i][j].Export());
		}
		this.old_rooms.push(row);
	}
	
	var room = this.rooms[this.room_index_y][this.room_index_x];
	this.checkpoint = {
		x: room.player.x, y: room.player.y, 
		room_x: this.room_index_x,
		room_y: this.room_index_y,
		facing: room.player.facing
	};
	this.old_checkpoint = null;
	this.new_checkpoint = null;
	callback();
}

House.prototype.Restart = function(){
	this.num_deaths = 0;
	this.spells_cast = 0;
	this.then = Date.now();
	this.time = 0;
	this.submitted = false;
	//this.beat_game = false;

	this.num_artifacts = 0;
	this.has_spellbook = false;
	this.spellbook = [];
	this.glitch_type = Glitch.GREY;
	this.glitch_index = -1;

	this.room_index_x = 0;
	this.room_index_y = 0;
	this.old_room_index_x = 0;
	this.old_room_index_y = 0;
	
	for (var i = 0; i < this.old_rooms.length; i++){
		for (var j = 0; j < this.old_rooms[i].length; j++){
			this.rooms[i][j].Import(this.old_rooms[i][j]);
		}
	}
	
	var room = this.rooms[this.room_index_y][this.room_index_x];
	room.player.x = 20;
	room.player.y = 72;
	room.player.facing = Facing.RIGHT;
	room.player.vel = {x: 0, y: 0};
	room.player.stuck_in_wall = false;
	this.DeactivateCheckpoints();
	this.checkpoint = {
		x: room.player.x, y: room.player.y, 
		room_x: this.room_index_x,
		room_y: this.room_index_y,
		facing: room.player.facing
	};
	this.old_checkpoint = null;
	this.new_checkpoint = null;
}

House.prototype.Reset = function(){
	this.room_index_x = 0;
	this.room_index_y = 0;
	room_manager.rooms = [[new Room()]];
	
	var room = this.rooms[this.room_index_y][this.room_index_x];
	this.checkpoint = {
		x: room.player.x, y: room.player.y, 
		room_x: this.room_index_x,
		room_y: this.room_index_y,
		facing: room.player.facing
	};
	
	this.num_artifacts = 0;
	
	this.ChangeRoom();
}

House.prototype.GetRoom = function(){
	console.log(this.room_index_x, this.room_index_y);
	return this.rooms[this.room_index_y][this.room_index_x];
}

House.prototype.ChangeRoom = function(){
	var clone = room.player;
	room.player.pressing_down = false;
	room.player.pressed_down = false;
	var glitch_type = this.glitch_type;
	var could_use_spellbook = room.can_use_spellbook;
		
	if (this.old_room_index_x != this.room_index_x || this.old_room_index_y != this.room_index_y){
		room = this.GetRoom();
		room.player.facing = clone.facing;
		room.player.vel = clone.vel;
		room.player.on_ground = clone.on_ground;
		
		
		room.glitch_type = glitch_type;
		if (!this.has_spellbook || !room.can_use_spellbook){
			room.glitch_index = 0;
			room.glitch_type = room.glitch_sequence[0];
			room.glitch_time = 0;
		}
		for (var i = 0; i < room.entities.length; i++){
			room.entities[i].ResetPosition();
		}
	}
	this.old_room_index_x = this.room_index_x;
	this.old_room_index_y = this.room_index_y;
	
	room.Speak(null);
	if (!room.can_use_spellbook)
		room.Speak("a dark force prevents\nyou from casting\nspells here");
	//MAKE SURE THE FORM CHANGE REMAINS BETWEEN ROOMS
	if (!could_use_spellbook){
		this.glitch_index = this.spellbook.length-1;
		Glitch.TransformPlayer(room, Glitch.GREY);
	}else{
		Glitch.TransformPlayer(room, room.glitch_type); //this.glitch);
	}
	//room.player.die_to_suffocation = true;
	
	var temp_bg_name = "Rolemusic_deathOnTheBattlefield";
	if (this.room_index_x === 5 && this.room_index_y === 0 && bg_name !== temp_bg_name){
		bg_name = temp_bg_name;
		if (resource_manager.play_music){
			stopMusic();
			startMusic();
		}
	}
	
	//END CONDITION LOL
	if (this.room_index_x === 5 && this.room_index_y === 5){
		Glitch.TransformPlayer(room, Glitch.GREY);
		this.time = Math.round(((((Date.now() - this.then) / 1000) / 60) + 0.00001) * 100) / 100;
		
		bg_name = "RoccoW_iveGotNothing";
		if (resource_manager.play_music){
			stopMusic();	
			startMusic();
		}
		
		room.ChangeSize(320, 120);
		room.player.x = 16;
	}
}

House.prototype.RandomGlitch = function(){
	if (this.room_index_x === 5 && this.room_index_y === 5) return;
	if (!this.GetRoom().can_use_spellbook){
		Utils.playSound("error", master_volume, 0);
		return;
	}
	this.spells_cast++;
	Utils.playSound("switchglitch", master_volume, 0);

	/*var rindex = Math.floor(Math.random()*this.spellbook.length);
	var glitch = this.spellbook[rindex];
	while (this.spellbook.length > 1 && glitch == this.glitch_type){
		rindex++;
		if (rindex >= this.spellbook.length) rindex = 0;
		glitch = this.spellbook[rindex];
	}*/
	this.glitch_index++;
	if (this.glitch_index >= this.spellbook.length) 
		this.glitch_index = 0; //-1;
		
	if (this.glitch_index < 0){
		//room.glitch_time = room.glitch_time_limit;
		this.glitch_type = Glitch.GREY;
	}
	if (this.glitch_index >= 0){
		this.glitch_type = this.spellbook[this.glitch_index];
		room.glitch_time = 0;
	}
	
	room.glitch_type = this.glitch_type;
	Glitch.TransformPlayer(room, this.glitch_type);
	
}

House.prototype.RevivePlayer = function(){
	this.num_deaths++;

	this.room_index_x = this.checkpoint.room_x;
	this.room_index_y = this.checkpoint.room_y;
	this.old_room_index_x = this.room_index_x;
	this.old_room_index_y = this.room_index_y;
	room = this.GetRoom();
	room.player = new Player();
	if (!this.has_spellbook || !room.can_use_spellbook){
		Glitch.TransformPlayer(room, room.glitch_type);
	}else{
		Glitch.TransformPlayer(room, this.glitch_type);
	}
	room.player.x = this.checkpoint.x;
	room.player.y = this.checkpoint.y;
	room.player.facing = this.checkpoint.facing;
	room.player.die_to_suffocation = true;
	console.log("num deaths: " + this.num_deaths);
	room.Speak(null);
	
	this.RemoveGlitchedCheckpoint();
}

House.prototype.DeactivateCheckpoints = function(){
	for (var i = 0; i < this.house_height; i++){
		for (var j = 0; j < this.house_width; j++){
			var room = this.rooms[i][j];
			for (var k = 0; k < room.entities.length; k++){
				if (room.entities[k].type === "Checkpoint"){
					room.entities[k].Deactivate();
				}
			}
		}
	}
}

House.prototype.RemoveGlitchedCheckpoint = function(){
	for (var i = 0; i < this.rooms.length; i++){
		for (var j = 0; j < this.rooms[i].length; j++){
			for (var k = 0; k < this.rooms[i][j].entities.length; k++){
				if (this.rooms[i][j].entities[k].type == "Checkpoint" && this.rooms[i][j].entities[k].is_glitched){
					this.rooms[i][j].entities.splice(k, 1);
				}
			}
		}
	}
	
	if (this.new_checkpoint != null){
		this.new_checkpoint = null;
		if (this.old_checkpoint != null){
			var room = this.rooms[this.old_checkpoint.room_y][this.old_checkpoint.room_x];
			for (var i = 0; i < room.entities.length; i++){
				if (room.entities[i].type === "Checkpoint" && !room.entities[i].is_glitched &&
						room.entities[i].x === this.old_checkpoint.x &&
						room.entities[i].y === this.old_checkpoint.y){
					
						this.checkpoint = this.old_checkpoint;
						this.old_checkpoint = null;
						//Utils.playSound("checkpoint", master_volume, 0);
						room.entities[i].active = true;
						room.entities[i].animation.Change(1, 0, 2);
				}
			}
		}
	}
}