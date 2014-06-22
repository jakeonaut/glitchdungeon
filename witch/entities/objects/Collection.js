function Collection(x, y, collection_id){
	GameMover.call(this, x, y, 2, 2, 14, 16, "collection_sheet");
	this.type = "Collection";
	this.collection_id = collection_id;
	this.animation.frame_delay = 30;
	
	var ani_x = Math.floor(this.collection_id / 6) * 2;
	var ani_y = this.collection_id % 6;
	this.animation.Change(ani_x, ani_y, 2);
	
	this.z_index = 8;
}
Collection.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
	this.collection_id = obj.collection_id;
	
	var ani_x = Math.floor(this.collection_id / 6) * 2;
	var ani_y = this.collection_id % 6;
	this.animation.Change(ani_x, ani_y, 2);
}

Collection.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.collection_id = this.collection_id;
	return obj;
}
extend(GameMover, Collection);

Collection.prototype.Update = function(delta, map){
	if (this.IsColliding(map.player)){
		this.delete_me = true;
		Utils.playSound("pickup", master_volume, 0);
		room_manager.num_artifacts++;
		room.Speak("item get: "+this.GetName());
		this.GetEvent();
	}
}

Collection.prototype.UpdateAnimationFromState = function(){
}

Collection.prototype.GetName = function(){
	switch (this.collection_id){
		case 0: return "spell book";
		case 1: return "red hex";
		case 2: return "blue spell";
		case 3: return "relic sword";
		case 4: return "magic shield";
		default: break;
	}
}

Collection.prototype.GetEvent = function(){
	switch (this.collection_id){
		case 1:
			room_manager.spellbook.push(Glitch.RED);
			break;
		case 2: 
			room_manager.spellbook.push(Glitch.BLUE);
			room_manager.rooms[0][2].entities.push(new NPC(6*Tile.WIDTH, 10*Tile.HEIGHT, 2));
			break;
		default: break;
	}
}