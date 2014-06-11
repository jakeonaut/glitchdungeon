function House(){
	this.room_index_x = 0;
	this.room_index_y = 0;
	
	this.house_width = 3;
	this.house_height = 3;
	this.SetUpRooms();
}

House.prototype.SetUpRooms = function(){
	var path = "witch/rooms/room_";
	
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