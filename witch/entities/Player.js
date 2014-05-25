function Player(x, y, img_name){
	GameMover.call(this, x, y, 2, 5, 14, 24, img_name);
	this.animation.frame_height = 24;
}
extend(GameMover, Player);