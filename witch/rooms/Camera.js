function Camera(x, y){
	this.x = x || 0;
	this.y = y || 0; 
	this.width = GAME_WIDTH;
	this.height = GAME_HEIGHT;
	this.x_lim = 100;
	this.y_lim = 100;
	
	this.instant = true;
	this.speed = 1.5;
}
		
Camera.prototype.Update = function(delta, map){
	var player = map.player;
	//Horizontal panning RIGHT
	if (player.x + player.rb + this.x_lim - this.x >= this.width){
		if (this.x < map.MAP_WIDTH * Tile.WIDTH - this.width){
			if (this.instant)
				this.x = (player.x + player.rb + this.x_lim) - this.width;
			else{
				this.x += this.speed;
				if (this.x >= map.MAP_WIDTH * Tile.WIDTH - this.width)
					this.x = map.MAP_WIDTH * Tile.WIDTH - this.width;
			}
		}
	} //HOrizontal panning LEFT
	if (player.x + player.lb - this.x_lim - this.x <= 0){
		if (this.x > 0){
			if (this.instant)
				this.x = (player.x + player.lb - this.x_lim);
			else{ 
				this.x -= this.speed;
				if (this.x <= 0) this.x = 0;
			}
		}
	}
	
	//Vertical panning DOWN
	if (player.y + player.bb + this.y_lim - this.y >= this.height){
		if (this.y < map.MAP_HEIGHT * Tile.HEIGHT - this.height){
			if (this.instant)
				this.y = (player.y + player.bb + this.y_lim) - this.height;
			else{
				this.y += this.speed;
				if (this.y >= map.MAP_HEIGHT * Tile.HEIGHT - this.height)
					this.y = map.MAP_HEIGHT * Tile.HEIGHT - this.height;
			}
		}
	} //vertical panning UPWARD
	if (player.y + player.tb - this.y_lim - this.y <= 0){
		if (this.y > 0){
			if (this.instant)
				this.y = (player.y + player.tb - this.y_lim);
			else{
				this.y -= this.speed;
				if (this.y <= 0) this.y = 0;
			}
		}
	}
}