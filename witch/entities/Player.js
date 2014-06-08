function Player(x, y){
	GameMover.call(this, x, y, 2, 5, 14, 24, "player_grey_sheet");
	this.type = "Player";
	this.animation.frame_height = 24;
	this.glitch_type = -1;
}
Player.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.img_name = "player_grey_sheet";
	//obj.glitch_type = this.glitch_type;
	return obj;
}

extend(GameMover, Player);