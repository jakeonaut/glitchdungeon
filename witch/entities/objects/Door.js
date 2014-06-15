function Door(x, y, room_x, room_y, door_id, locked, num_artifacts){
	GameSprite.call(this, x, y, 0, 0, 16, 16, "obj_sheet");
	this.type = "Door";
	
	this.room_x = room_x;
	this.room_y = room_y;
	this.door_id = door_id;
	
	this.locked = locked || false;
	this.num_artifacts = num_artifacts || 0;
}
Door.prototype.Import = function(obj){
	GameSprite.prototype.Import.call(this, obj);
	
	this.room_x = obj.room_x;
	this.room_y = obj.room_y;
	this.door_id = obj.door_id;
	this.locked = obj.locked || false;
	this.num_artifacts = obj.num_artifacts || 0;
	
	this.talking = false;
}
Door.prototype.Export = function(){
	var obj = GameSprite.prototype.Export.call(this);
	obj.room_x = this.room_x;
	obj.room_y = this.room_y;
	obj.door_id = this.door_id;
	obj.locked = this.locked;
	obj.num_artifacts = this.num_artifacts;
	return obj;
}

Door.prototype.Update = function(delta, map){
	GameSprite.prototype.Update.call(this, delta, map);
	
	if (this.IsColliding(map.player)){
		if (map.player.on_ground){
			map.player.touching_door = true;
			if (map.player.pressed_down && map.player.pressing_down){
				map.player.pressed_down = false;
				
				if (this.locked){
					if (room_manager.num_artifacts >= this.num_artifacts){
						this.locked = false;
						room.Speak("door unlocked");
						Utils.playSound("LA_Chest_Open", master_volume, 0);
						this.talking = true;
					}else{
						room.Speak("door is locked\nneed " + (this.num_artifacts-room_manager.num_artifacts) + " artifacts more");
						Utils.playSound("locked", master_volume, 0);
						this.talking = true;
					}
				}
				else{
					this.SwitchRooms(map);
					Utils.playSound("LA_Stairs", master_volume, 0);
				}
			}
		}
	}
	else if (this.talking){
		this.talking = false;
		room.Speak(null);
	}
	
	if (this.locked) this.animation.Change(0, 1, 2);
	else this.animation.Change(0, 0, 1);
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
	
	room_manager.ChangeRoom();
	
	console.log("door id: " + this.door_id);
	var door = room.GetDoor(this.door_id);
	if (door !== null){
		room.player.x = door.x;
		room.player.y = door.y + door.bb - room.player.bb;
		room.player.facing = map.player.facing;
		room.player.pressing_down = false;
	}
}