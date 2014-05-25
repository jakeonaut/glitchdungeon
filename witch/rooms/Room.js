function Room(){
	this.MAP_WIDTH = GAME_WIDTH / Tile.WIDTH;
	this.MAP_HEIGHT = GAME_HEIGHT / Tile.HEIGHT;
	
	this.CreateEntities();
	this.InitializeTiles();
}

Room.prototype.CreateEntities = function(){
	this.player = new Player(GAME_WIDTH/2, GAME_HEIGHT-Tile.HEIGHT-16, "player_sheet");
	this.entities = [];
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

Room.prototype.isValidTile = function(i, j){
	return !(i < 0 || i >= this.MAP_HEIGHT || j < 0 || j >= this.MAP_WIDTH);
}

Room.prototype.Update = function(input, delta){
	input.Update(this.player);
	this.player.Update(delta/1000, this);
	for (var i = this.entities.length-1; i >= 0; i--){
		this.entities.Update(delta/1000, this);
		if (this.entities.delete_me) this.entities.splice(i, 1);
	}
}

Room.prototype.Render = function(ctx, level_edit){
	for (var i = 0; i < this.MAP_HEIGHT; i++){ for (var j = 0; j < this.MAP_WIDTH; j++){
		this.tiles[i][j].Render(ctx);
	} }
	if (level_edit) DrawLevelEditGrid(ctx, this);
	
	for (var i = 0; i < this.entities.length; i++){
		this.entities.Render(ctx);
	}
	
	this.player.Render(ctx);
}

/************************EXPORTING AND IMPORTING FUNCTIONS************/
Room.prototype.Export = function(){
	var entities = [], tiles = [];
	for (var i = 0; i < this.entities.length; i++){
		entities.push({type: this.entities[i].type, obj: this.entities[i].Export()});
	}
	for (var i = 0; i < this.tiles.length; i++){
		var row = [];
		for (var j = 0; j < this.tiles[i].length; j++){
			row.push(this.tiles[i][j].Export());
		}
		tiles.push(row);
	}

	return {
		player: {type: "Player", obj: this.player.Export()}
		,entities: entities
		,tiles: tiles
	};
}

Room.Import = function(file_name){
	var room = new Room();
	var obj_str = readTextFile(file_name);
	if (obj_str !== null && obj_str !== ""){
		room.Import(JSON.parse(obj_str));
	}
	return room;
}

Room.prototype.Import = function(room){
	this.player = new Player(); this.player.Import(room.player.obj);
	
	//import entities
	this.entities = [];
	if (room.entities){
		for (var i = 0; i < room.entities.length; i++){
			var entity = eval(room.entities.length[i].type + "();");
			entity.Import(room.entities.length[i].obj);
			this.entities.push(entity);
		}
	}
	
	//Import tiles!!!
	this.tiles = [];
	for (var i = 0; i < room.tiles.length; i++){
		var row = [];
		for (var j = 0; j < room.tiles[i].length; j++){
			var tile = new Tile(); tile.Import(room.tiles[i][j]);
			row.push(tile);
		}
		this.tiles.push(row);
	}
}