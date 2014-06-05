Glitch.MARIO = 0;

function Glitch(x, y, glitch_type){
	GameSprite.call(this, x, y, 2, 5, 14, 24, "glitch_sheet");
	this.type = "Glitch";
	this.glitch_type = glitch_type;
	this.animation.frame_height = 24;
	this.animation.Change(0, 0, 8);
}
Glitch.prototype.Import = function(obj){
	GameSprite.prototype.Import.call(this, obj);
	this.glitch_type = obj.glitch_type;
}
Glitch.prototype.Export = function(){
	var obj = GameSprite.prototype.Export.call(this);
	obj.glitch_type = this.glitch_type;
	return obj;
}

Glitch.prototype.Update = function(delta, map){
	GameSprite.prototype.Update.call(this, delta, map);
	
	if (this.IsColliding(map.player)){
		this.delete_me = true;
		Glitch.TransformPlayer(map.player, this.glitch_type);
	}
}

Glitch.TransformPlayer = function(player, glitch_type){
	var oldbb = player.bb;
	player.glitch_type = glitch_type;
	switch (glitch_type){
		case Glitch.MARIO:
			player.animation.frame_height = 16;
			player.img_name = "mario_sheet";
			player.lb = 2;
			player.tb = 2;
			player.rb = 14;
			player.bb = 16;
			
			player.jump_vel = 6.4;
			break;
		default: break;
	}

	player.y += oldbb - player.bb;
	player.image = eval("resource_manager." + player.img_name);
}
extend(GameSprite, Glitch);