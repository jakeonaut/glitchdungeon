function House(){
	this.room_index_x = 0;
	this.room_index_y = 0;
	this.SetUpRooms();
}

House.prototype.SetUpRooms = function(){
	var path = "witch/rooms/";

	this.rooms = [
		[Room.Import(path + "room_0_0.txt"), Room.Import(path + "room_1_0.txt"), Room.Import(path + "room_2_0.txt")],
		[Room.Import(path + "room_0_1.txt"), Room.Import(path + "room_1_1.txt"), Room.Import(path + "room_2_1.txt")]
	];
}

House.prototype.GetRoom = function(){
	console.log(this.room_index_x, this.room_index_y);
	return this.rooms[this.room_index_y][this.room_index_x];
}

House.prototype.Export = function(){
	var house = {};
	house.room_index_x = this.room_index_x;
	house.room_index_y = this.room_index_y;
	
	house.rooms = [];
	for (var i = 0; i < this.rooms.length; i++){
		var row = [];
		for (var j = 0; j < this.rooms[i].length; j++){
			row.push(this.rooms[i][j].Export());
		}
		house.rooms.push(row);
	}
	return house;
}

House.prototype.Import = function(house){
	this.room_index_x = house.room_index_x;
	this.room_index_y = house.room_index_y;

	this.rooms = [];
	for (var i = 0; i < house.rooms.length; i++){
		var row = [];
		for (var j = 0; j < house.rooms[i].length; j++){
			var room = new Room();
			room.Import(house.rooms[i][j]);
			row.push(room);
		}
		this.rooms.push(row);
	}
}