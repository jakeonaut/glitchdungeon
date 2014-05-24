function Room(){
	this.MAP_WIDTH = GAME_WIDTH / Tile.WIDTH;
	this.MAP_HEIGHT = GAME_HEIGHT / Tile.HEIGHT;
	
	this.CreateEntities();
	this.InitializeTiles();
}

Room.prototype.CreateEntities = function(){
	this.player = new Player(GAME_WIDTH/2, GAME_HEIGHT-Tile.HEIGHT-16, resource_manager.player_sheet);
}

Room.prototype.InitializeTiles = function(){
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
		this.tiles[this.MAP_HEIGHT-1][j].collision = Tile.SOLID;
	}
	
	//make left and right rows solid
	for (var i = 0; i < this.MAP_HEIGHT; i++){
		this.tiles[i][0].collision = Tile.SOLID;
		this.tiles[i][this.MAP_WIDTH-1].collision = Tile.SOLID;
	}
}

Room.prototype.Update = function(input, delta){
	input.Update(this.player);
	this.player.Update(delta/1000, this);
}

Room.prototype.Render = function(ctx, level_edit){
	for (var i = 0; i < this.MAP_HEIGHT; i++){ for (var j = 0; j < this.MAP_WIDTH; j++){
		this.tiles[i][j].Render(ctx);
	} }
	
	if (level_edit) DrawLevelEditGrid(ctx, this);
	
	this.player.Render(ctx);
}