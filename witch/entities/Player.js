function Player(x, y){
	GameMover.call(this, x, y, 2, 5, 14, 24, "player_sheet");
	this.type = "Player";
	this.animation.frame_height = 24;
	this.glitch_type = -1;
}
Player.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
	this.glitch_type = obj.glitch_type;
	
	Glitch.TransformPlayer(this, this.glitch_type);
}
Player.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.glitch_type = this.glitch_type;
	return obj;
}

Player.prototype.GetTilesetName = function(){
	switch (this.glitch_type){
		case Glitch.MARIO:
			return "mario_tile_sheet";
		default:
			return "tile_sheet";
	}
}

extend(GameMover, Player);