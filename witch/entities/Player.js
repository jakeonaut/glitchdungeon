function Player(x, y){
	GameMover.call(this, x, y, 2, 5, 14, 24, "player_grey_sheet");
	this.type = "Player";
	this.animation.frame_height = 24;
	this.glitch_type = 0;
	this.glitches = [true];
}

Player.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
	this.glitch_type = defaultValue(obj.glitch_type, 0);
	this.glitches = defaultValue(obj.glitches, [true]);
}

Player.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.img_name = "player_grey_sheet";
	obj.glitch_type = this.glitch_type;
	obj.glitches = this.glitches;
	return obj;
}

extend(GameMover, Player);

Player.prototype.SwitchGlitchRight = function(){
	this.SwitchGlitch(1);
}

Player.prototype.SwitchGlitchLeft = function(){
	this.SwitchGlitch(-1);
}

Player.prototype.SwitchGlitch = function(dir){
	this.glitch_type+=dir;
	
	if (this.glitch_type >= this.glitches.length)
		this.glitch_type = 0;
	if (this.glitch_type < 0)
		this.glitch_type = this.glitches.length-1;

	while (!this.glitches[this.glitch_type]){
		this.glitch_type+=dir;
		
		if (this.glitch_type >= this.glitches.length)
			this.glitch_type = 0;
		if (this.glitch_type < 0)
			this.glitch_type = this.glitches.length-1;
	}
	Glitch.TransformPlayer(room, this.glitch_type);
}