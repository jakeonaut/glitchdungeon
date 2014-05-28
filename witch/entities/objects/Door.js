function Door(x, y, room_x, room_y){
	GameMover.call(this, x, y, 2, 5, 14, 24, "obj_sheet");
	this.type = "Door";
	this.animation.frame_height = 24;
	
	this.room_x = room_x;
	this.room_y = room_y;
}
Door.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
	
	this.room_x = obj.room_x;
	this.room_y = obj.room_y;
}
Door.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.room_x = this.room_x;
	obj.room_y = this.room_y;
	return obj;
}

Door.prototype.Update = function(delta, map){
	GameSprite.prototype.Update.call(this, delta, map);
	
	if (this.IsColliding(map.player) && map.player.pressed_down){
		map.player.pressed_down = false;
		
		room_manager.room_index_x = this.room_x;
		room_manager.room_index_y = this.room_y;
		room = room_manager.GetRoom();
	}
}
extend(GameSprite, Door);