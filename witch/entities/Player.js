function Player(x, y, image){
	GameMover.call(this, x, y, 2, 5, 14, 24, image);
	this.animation.frame_height = 24;
}
extend(GameMover, Player);