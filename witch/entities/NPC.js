function NPC(x, y, npc_id){
	GameMover.call(this, x, y, 2, 2, 14, 16, "npc_sheet");
	this.type = "NPC";
	this.npc_id = npc_id;
	this.animation.frame_delay = 30;
}
NPC.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
	this.npc_id = obj.npc_id;
}

NPC.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.npc_id = this.npc_id;
	return obj;
}
extend(GameMover, NPC);

NPC.prototype.Update = function(delta, map){
	GameMover.prototype.Update.call(this, delta, map);
	
	var d = 16;
	var dy = 8;
	var px = map.player.x + (map.player.rb/2);
	if (map.player.y + map.player.bb > this.y - dy && map.player.y < this.y + this.bb + dy){
		if (px < this.x + this.lb && px > this.x + this.lb - d){
			this.facing = Facing.LEFT;
		}
		if (px > this.x + this.rb && px < this.x + this.rb + d){
			this.facing = Facing.RIGHT;
		}
	}
	
	
	//TALK TO PLAYER AND SUCH
	if (this.IsRectColliding(map.player, this.x+this.lb-Tile.WIDTH, this.y+this.tb, this.x+this.rb+Tile.WIDTH, this.y+this.bb)){
		this.talking = true;
		room.Speak("NPC: "+this.GetText());
	}
	else if (this.talking){
		this.talking = false;
		room.Speak(null);
	}
}

NPC.prototype.UpdateAnimationFromState = function(){
	var ani_x = 0;//this.npc_id / 2;
	var ani_y = 0;//this.npc_id % 2;
	this.animation.Change(ani_x, ani_y, 2);
	
	if (this.facing === Facing.LEFT){
		this.animation.abs_ani_y = 2 * this.animation.frame_height;
	}else if (this.facing === Facing.RIGHT){
		this.animation.abs_ani_y = 0;
	}
	this.prev_move_state = this.move_state;
}

//TEXT BABY
NPC.prototype.GetText = function(){
	switch (this.npc_id){
		case -1:
			return "hold up to jump higher";
		case 0:
			return "you must escape\n the labyrinth";
		case 1:
			return "press down to fall\n and to enter doors";
		case 2:
			return "it's so lonely here";
		case 3:
			return "press space bar\n to cast a spell";
		case 4:
			return "press down to\nplace a memory";
		default:
			break;
	}
}