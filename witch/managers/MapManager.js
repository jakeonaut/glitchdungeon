function MapManager(){
	this.MAP_WIDTH = GAME_WIDTH / Tile.WIDTH;
	this.MAP_HEIGHT = GAME_HEIGHT / Tile.HEIGHT;

	this.tiles = [];
	for (var i = 0; i < this.MAP_HEIGHT; i++){
		this.tiles[i] = [];
		for (var j = 0; j < this.MAP_WIDTH; j++){
			this.tiles[i].push(new Tile(j * Tile.WIDTH, i * Tile.HEIGHT));
		}
	}
	
	//make the top and bottom row solid
	for (var j = 0; j < this.MAP_WIDTH; j++){
		this.tiles[0][j].solid = true;
		this.tiles[this.MAP_HEIGHT-1][j].solid = true;
	}
	
	//make left and right rows solid
	for (var i = 0; i < this.MAP_HEIGHT; i++){
		this.tiles[i][0].solid = true;
		this.tiles[i][this.MAP_WIDTH-1].solid = true;
	}
}

MapManager.prototype.Render = function(ctx){
	for (var i = 0; i < this.MAP_HEIGHT; i++){
		for (var j = 0; j < this.MAP_WIDTH; j++){
			this.tiles[i][j].Render(ctx);
		}
	}
}