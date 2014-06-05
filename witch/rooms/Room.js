function Room(){
	this.SCREEN_WIDTH = GAME_WIDTH;
	this.SCREEN_HEIGHT = GAME_HEIGHT;
	
	this.MAP_WIDTH = ~~(GAME_WIDTH / Tile.WIDTH);
	this.MAP_HEIGHT = ~~(GAME_HEIGHT / Tile.HEIGHT);
	
	this.camera = new Camera();
	this.CreateEntities();
	this.InitializeTiles();
}

Room.prototype.CreateEntities = function(){
	this.player = new Player(GAME_WIDTH/2, GAME_HEIGHT-Tile.HEIGHT-16);
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
		this.tiles[0][j].tileset_y = 1;
		
		this.tiles[this.MAP_HEIGHT-1][j].collision = Tile.SOLID;
		this.tiles[this.MAP_HEIGHT-1][j].tileset_y = 1;
	}
	
	//make left and right rows solid
	for (var i = 0; i < this.MAP_HEIGHT; i++){
		this.tiles[i][0].collision = Tile.SOLID;
		this.tiles[i][0].tileset_y = 1;
		
		this.tiles[i][this.MAP_WIDTH-1].collision = Tile.SOLID;
		this.tiles[i][this.MAP_WIDTH-1].tileset_y = 1;
	}
}

Room.prototype.isValidTile = function(i, j){
	return !(i < 0 || i >= this.MAP_HEIGHT || j < 0 || j >= this.MAP_WIDTH);
}

Room.prototype.Update = function(input, delta){
	input.Update(this.player);
	this.player.Update(delta/1000, this);
	this.camera.Update(delta/1000, this);
	
	for (var i = this.entities.length-1; i >= 0; i--){
		this.entities[i].Update(delta/1000, this);
		if (this.entities[i].delete_me) this.entities.splice(i, 1);
	}
}

Room.prototype.Render = function(ctx, level_edit){
	ctx.fillStyle = "rgb(128, 128, 128)";
	ctx.fillRect(this.camera.screen_offset_x, this.camera.screen_offset_y, 
		this.MAP_WIDTH*Tile.WIDTH, this.MAP_HEIGHT*Tile.HEIGHT);

	var tile_img = eval("resource_manager." + this.player.GetTilesetName());
	for (var i = 0; i < this.MAP_HEIGHT; i++){ for (var j = 0; j < this.MAP_WIDTH; j++){
		this.tiles[i][j].Render(ctx, this.camera, tile_img);
	} }
	if (level_edit) DrawLevelEditGrid(ctx, this);
	
	for (var i = 0; i < this.entities.length; i++){
		this.entities[i].Render(ctx, this.camera);
	}
	
	this.player.Render(ctx, this.camera);
}

/********************OTHER LEVEL EDITING FUNCTIONS********************/
Room.prototype.ChangeSize = function(width, height){
	var old_width = this.MAP_WIDTH;
	var old_height = this.MAP_HEIGHT;
	this.MAP_WIDTH = ~~(width / Tile.WIDTH);
	this.MAP_HEIGHT = ~~(height / Tile.HEIGHT);
	
	if (this.MAP_WIDTH * Tile.WIDTH < this.SCREEN_WIDTH)
		this.camera.screen_offset_x = (this.SCREEN_WIDTH - (this.MAP_WIDTH * Tile.WIDTH))/2;
	else this.camera.screen_offset_x = 0;
	if (this.MAP_WIDTH * Tile.HEIGHT < this.SCREEN_HEIGHT)
		this.camera.screen_offset_y = (this.SCREEN_HEIGHT-(this.MAP_HEIGHT*Tile.HEIGHT))/2;
	else this.camera.screen_offset_y = 0;

	var temp_tiles = this.tiles;
	this.InitializeTiles();
	
	for (var i = 0; i < this.MAP_HEIGHT; i++){
		if (i >= old_height) this.tiles[i] = [];
		for (var j = 0; j < this.MAP_WIDTH; j++){
			if (i >= old_height) 
				this.tiles[i].push(new Tile(j * Tile.WIDTH, i * Tile.HEIGHT));
			else if (j >= old_width)
				this.tiles[i].push(new Tile(j * Tile.WIDTH, i * Tile.HEIGHT));
			else this.tiles[i][j] = temp_tiles[i][j];
		}
	}
	console.log("NEW WIDTH: ", this.MAP_WIDTH);
	console.log("NEW HEIGHT: ", this.MAP_HEIGHT);
}

Room.prototype.GetDoor = function(door_id){
	for (var i = 0; i < this.entities.length; i++){
		if (this.entities[i].type == "Door"){
			if (this.entities[i].door_id == door_id)
				return this.entities[i];
		}
	}
	return null;
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
			var entity = eval("new " + room.entities[i].type + "();");
			entity.Import(room.entities[i].obj);
			this.entities.push(entity);
		}
	}
	
	//Import tiles!!!
	this.tiles = [];
	this.MAP_WIDTH = room.tiles[0].length;
	this.MAP_HEIGHT = room.tiles.length;
	for (var i = 0; i < room.tiles.length; i++){
		var row = [];
		for (var j = 0; j < room.tiles[i].length; j++){
			var tile = new Tile(); tile.Import(room.tiles[i][j]);
			row.push(tile);
		}
		this.tiles.push(row);
	}
}