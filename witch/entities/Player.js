function Player(x, y){
	GameMover.call(this, x, y, 2, 5, 14, 24, "player_sheet");
	this.type = "Player";
	this.animation.frame_height = 24;
}
extend(GameMover, Player);