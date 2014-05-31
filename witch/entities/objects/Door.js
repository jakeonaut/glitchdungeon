function Door(x, y, room_x, room_y, door_id){
	GameMover.call(this, x, y, 2, 5, 14, 24, "obj_sheet");
	this.type = "Door";
	this.animation.frame_height = 24;
	
	this.room_x = room_x;
	this.room_y = room_y;
	this.door_id = door_id;
}
Door.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
	
	this.room_x = obj.room_x;
	this.room_y = obj.room_y;
	this.door_id = obj.door_id;
}
Door.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.room_x = this.room_x;
	obj.room_y = this.room_y;
	obj.door_id = this.door_id;
	return obj;
}

Door.prototype.Update = function(delta, map){
	GameSprite.prototype.Update.call(this, delta, map);
	
	if (this.IsColliding(map.player) && map.player.pressed_down){
		map.player.pressed_down = false;
		var facing = map.player.facing;
		
		room_manager.room_index_x = this.room_x;
		room_manager.room_index_y = this.room_y;
		room = room_manager.GetRoom();
		
		var door = room.GetDoor(this.door_id);
		room.player.x = door.x;
		room.player.y = door.y;
		room.player.facing = facing;
		room.player.pressing_down = false;
	}
}
extend(GameSprite, Door);