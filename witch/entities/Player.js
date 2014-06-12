function Player(x, y){
	GameMover.call(this, x, y, 2, 5, 14, 24, "player_grey_sheet");
	this.type = "Player";
	this.animation.frame_height = 24;
	this.touching_door = false;
	this.touching_checkpoint = false;
}

Player.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
}

Player.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.img_name = "player_grey_sheet";
	return obj;
}
Player.prototype.Update = function(delta, map){
	GameMover.prototype.Update.call(this, delta, map);
	this.touching_door = false;
}

extend(GameMover, Player);