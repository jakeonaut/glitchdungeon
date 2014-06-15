function House(){
	this.room_index_x = 0;
	this.room_index_y = 0;
	
	this.house_width = 4;
	this.house_height = 3;
	this.SetUpRooms();
	
	var room = this.rooms[this.room_index_y][this.room_index_x];
	var self = this;
	this.checkpoint = {
		x: room.player.x, y: room.player.y, 
		room_x: self.room_index_x,
		room_y: self.room_index_y,
		facing: room.player.facing
	};
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

House.prototype.RevivePlayer = function(){
	this.room_index_x = this.checkpoint.room_x;
	this.room_index_y = this.checkpoint.room_y;
	room = this.GetRoom();
	room.player = new Player();
	Glitch.TransformPlayer(room, room.glitch_type);
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