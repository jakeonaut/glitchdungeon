function NPC(x, y, npc_id){
	GameMover.call(this, x, y, 2, 5, 14, 24, "npc_sheet");
	this.type = "NPC";
	this.npc_id = npc_id;
	this.animation.frame_height = 24;
	this.animation.frame_delay = 30;
}
NPC.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
	this.npc_id = obj.npc_id;
}

NPC.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.npc_id = this.npd_id;
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
}

NPC.prototype.UpdateAnimationFromState = function(){
	this.animation.Change(0, 0, 2);
	
	if (this.facing === Facing.LEFT){
		this.animation.abs_ani_y = 2 * this.animation.frame_height;
	}else if (this.facing === Facing.RIGHT){
		this.animation.abs_ani_y = 0;
	}
	this.prev_move_state = this.move_state;
}