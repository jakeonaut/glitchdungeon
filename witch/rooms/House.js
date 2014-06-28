function House(){
	this.num_artifacts = 0;
	this.has_spellbook = false;
	this.spellbook = [];
	this.glitch_type = Glitch.GREY;
	this.glitch_index = -1;

	this.room_index_x = 0;
	this.room_index_y = 0;
	this.old_room_index_x = 0;
	this.old_room_index_y = 0;
	
	this.house_width = 5;
	this.house_height = 5;
	this.SetUpRooms();
	
	var room = this.rooms[this.room_index_y][this.room_index_x];
	this.checkpoint = {
		x: room.player.x, y: room.player.y, 
		room_x: this.room_index_x,
		room_y: this.room_index_y,
		facing: room.player.facing
	};
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

House.prototype.SetUpRooms = function(){
	var path = "witch/rooms/rooms/room_";
	
	this.rooms = [];
	for (var i = 0; i < this.house_height; i++){
		var row = [];
		for (var j = 0; j < this.house_width; j++){
			row.push(Room.Import(path + j + "_" + i + ".txt"));
		}
		this.rooms.push(row);
	}
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
		
	if (this.old_room_index_x != this.room_index_x || this.old_room_index_y != this.room_index_y){
		room = this.GetRoom();
		room.player.facing = clone.facing;
		room.player.vel = clone.vel;
		room.player.on_ground = clone.on_ground;
		
		
		room.glitch_type = glitch_type;
		if (!this.has_spellbook){
			room.glitch_index = 0;
			room.glitch_type = room.glitch_sequence[0];
		}
		for (var i = 0; i < room.entities.length; i++){
			room.entities[i].ResetPosition();
		}
	}
	this.old_room_index_x = this.room_index_x;
	this.old_room_index_y = this.room_index_y;
	
	room.Speak(null);
	
	//MAKE SURE THE FORM CHANGE REMAINS BETWEEN ROOMS
	Glitch.TransformPlayer(room, room.glitch_type); //this.glitch);
}

House.prototype.RandomGlitch = function(){
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
	this.room_index_x = this.checkpoint.room_x;
	this.room_index_y = this.checkpoint.room_y;
	this.old_room_index_x = this.room_index_x;
	this.old_room_index_y = this.room_index_y;
	room = this.GetRoom();
	room.player = new Player();
	if (!this.has_spellbook){
		Glitch.TransformPlayer(room, room.glitch_type);
	}else{
		Glitch.TransformPlayer(room, this.glitch_type);
	}
	room.player.x = this.checkpoint.x;
	room.player.y = this.checkpoint.y;
	room.player.facing = this.checkpoint.facing;
	
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