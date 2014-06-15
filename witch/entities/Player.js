function Player(x, y){
	GameMover.call(this, x, y, 2, 1, 14, 16, "player_grey_sheet");
	this.type = "Player";
	this.animation.frame_height = 16;
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
	this.DieToSpikesAndStuff(map);
	GameMover.prototype.Update.call(this, delta, map);
	this.touching_door = false;
}

Player.prototype.DieToSpikesAndStuff = function(map){
	var q = 3;
	var x = this.x;
	var y = this.y;
	var lb = this.lb;
	var tb = this.tb;
	var rb = this.rb;
	var bb = this.bb;
	for (var i = 0; i < map.entities.length; i++){
		if (map.entities[i].kill_player && (this.IsRectColliding(map.entities[i], x+lb+q, y+tb+q,x+rb-q,y+bb-q))){
			this.Die();
		}
	}

	//Colliding with spikes
	var left_tile = Math.floor((this.x + this.lb + this.vel.x - 1) / Tile.WIDTH);
	var right_tile = Math.ceil((this.x + this.rb + this.vel.x + 1) / Tile.WIDTH);
	var top_tile = Math.floor((this.y + this.tb + this.vel.y - 1) / Tile.HEIGHT);
	var bottom_tile = Math.ceil((this.y + this.bb + this.vel.y + 1) / Tile.HEIGHT);
	
	for (var i = top_tile; i <= bottom_tile; i++){
		for (var j = left_tile; j <= right_tile; j++){
			if (!map.isValidTile(i, j)) continue;
			var tile = map.tiles[i][j];
			if (tile.collision != Tile.KILL_PLAYER && !tile.kill_player) continue;
			
			if (this.IsRectColliding(tile, x+lb+q, y+tb+q,x+rb-q,y+bb-q)){
				this.Die();
			}
		}
	}
}

Player.prototype.Die = function(){
	room_manager.RevivePlayer();
}



extend(GameMover, Player);