function Door(x, y, room_x, room_y, door_id){
	GameSprite.call(this, x, y, 2, 5, 14, 24, "obj_sheet");
	this.type = "Door";
	this.animation.frame_height = 24;
	
	this.room_x = room_x;
	this.room_y = room_y;
	this.door_id = door_id;
}
Door.prototype.Import = function(obj){
	GameSprite.prototype.Import.call(this, obj);
	
	this.room_x = obj.room_x;
	this.room_y = obj.room_y;
	this.door_id = obj.door_id;
}
Door.prototype.Export = function(){
	var obj = GameSprite.prototype.Export.call(this);
	obj.room_x = this.room_x;
	obj.room_y = this.room_y;
	obj.door_id = this.door_id;
	return obj;
}

Door.prototype.Update = function(delta, map){
	GameSprite.prototype.Update.call(this, delta, map);
	
	if (this.IsColliding(map.player) && map.player.on_ground){
		map.player.touching_door = true;
		if (map.player.pressed_down && map.player.pressing_down){
			map.player.pressed_down = false;
		
			this.SwitchRooms(map);
		}
	}
}
extend(GameSprite, Door);

Door.prototype.SwitchRooms = function(map){
	room_manager.room_index_x = this.room_x;
	room_manager.room_index_y = this.room_y;
	
	if (room_manager.room_index_y >= room_manager.rooms.length){
		room_manager.rooms[this.room_y] = [];
	}
	if (room_manager.room_index_x >= room_manager.rooms[this.room_y].length){
		room_manager.rooms[this.room_y][this.room_x] = new Room();
	}
	
	room = room_manager.GetRoom();
	
	//MAKE SURE THE FORM CHANGE REMAINS BETWEEN ROOMS
	room.player.glitches = map.player.glitches;
	Glitch.TransformPlayer(room, room.glitch_type);
	
	var door = room.GetDoor(this.door_id);
	if (door !== null){
		room.player.x = door.x;
		room.player.y = door.y + door.bb - room.player.bb;
		room.player.facing = map.player.facing;
		room.player.pressing_down = false;
	}
}