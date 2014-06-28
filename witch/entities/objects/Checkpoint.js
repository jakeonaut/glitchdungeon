function Checkpoint(x, y){
	GameSprite.call(this, x, y, 4, 5, 12, 16, "obj_sheet");
	this.type = "Checkpoint";
	
	this.active = false;
	this.animation.Change(2, 0, 1);
	this.lex = 1;
	
	this.z_index = 9;
}

Checkpoint.prototype.Update = function(delta, map){
	GameSprite.prototype.Update.call(this, delta, map);
	
	if (this.IsColliding(map.player)){
		map.player.touching_checkpoint = true;
		if (!this.active){
			if (!this.is_glitched) room_manager.RemoveGlitchedCheckpoint();
			room_manager.DeactivateCheckpoints();
			room_manager.checkpoint = {
				x: this.x, y: this.y, 
				room_x: room_manager.room_index_x,
				room_y: room_manager.room_index_y,
				facing: room.player.facing
			}
			Utils.playSound("checkpoint", master_volume, 0);
			this.active = true;
			this.animation.Change(this.lex, 0, 2);
		}
	}
}
extend(GameSprite, Checkpoint);

Checkpoint.prototype.Deactivate = function(){
	this.active = false;
	this.animation.Change(this.lex+1, 0, 1);
}