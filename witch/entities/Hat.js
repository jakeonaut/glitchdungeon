function Hat(x, y){
	GameMover.call(this, x, y, 2, 1, 14, 16, "hat_grey_sheet");
	this.type = "Hat";
	this.animation.frame_height = 16;
	
	this.z_index = -101;
}

Hat.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
}

Hat.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.img_name = "hat_grey_sheet";
	return obj;
}
Hat.prototype.Update = function(delta, map){
	//GameMover.prototype.Update.call(this, delta, map);
	
	this.x = map.player.x-1;
	this.y = map.player.y-6;
	this.facing = map.player.facing;
	if (this.facing === Facing.LEFT)
		this.x += 2;
	this.move_state = map.player.move_state;
	if (this.move_state === MoveState.FALLING)
		this.y -= 1;
	this.animation = map.player.animation;
	
	//this.UpdateAnimationFromState();
	//GameSprite.prototype.Update.call(this, delta, map);
}

Hat.prototype.Render = function(ctx, camera){
	if (!room_manager.beat_game) return;
	
	GameMover.prototype.Render.call(this, ctx, camera);
}

extend(GameMover, Hat);