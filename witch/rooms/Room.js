Room.GLITCH_TIME_LIMIT_ORIGINAL = 240;

function Room(){
	this.SCREEN_WIDTH = GAME_WIDTH;
	this.SCREEN_HEIGHT = GAME_HEIGHT;
	
	this.MAP_WIDTH = ~~(GAME_WIDTH / Tile.WIDTH);
	this.MAP_HEIGHT = ~~(GAME_HEIGHT / Tile.HEIGHT);
	
	this.glitch_type = Glitch.GREY
	this.glitch_sequence = [];
	this.glitch_time = 0;
	this.glitch_index = 0;
	this.glitch_time_limit = Room.GLITCH_TIME_LIMIT_ORIGINAL;
	this.can_use_spellbook = true;
	
	this.bg_code = "";
	
	this.spoken_text = "";
	this.speech_timer = 0;
	this.speech_time_limit = 0;
	
	this.tilesheet_name = "tile_grey_sheet";
	this.camera = new Camera();
	this.CreateEntities();
	this.InitializeTiles();
}

Room.prototype.CreateEntities = function(){
	this.player = new Player(GAME_WIDTH/2, GAME_HEIGHT-Tile.HEIGHT-16);
	this.entities = [new Hat(this.player.x, this.player.y-8)];
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
		this.tiles[0][j].collision = Tile.SOLID;
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
	this.player.Update(delta, this);
	this.TryUpdateRoomIfPlayerOffscreen();
	this.camera.Update(delta, this);
	
	for (var i = this.entities.length-1; i >= 0; i--){
		this.entities[i].Update(delta, this);
		if (this.entities[i].delete_me) this.entities.splice(i, 1);
	}
	
	//UPDATE GLITCH SEQUENCE
	if (room_manager && !room_manager.has_spellbook || !this.can_use_spellbook){
		this.glitch_time+=(delta/DNUM);
		
		if (this.glitch_sequence.length > 1 
				&& this.glitch_time > this.glitch_time_limit - 60 
				&& this.glitch_time < this.glitch_time_limit)
		{		
			if ((~~this.glitch_time) % 20 === 0){
				var temp_index = this.glitch_index;
				temp_index++;
				if (temp_index >= this.glitch_sequence.length)
					temp_index = 0;
				Glitch.TransformPlayer(this, this.glitch_sequence[temp_index], false, true);
			}else if (((~~this.glitch_time) - 10) % 20 === 0){
				Glitch.TransformPlayer(this, this.glitch_sequence[this.glitch_index], false, true);
			}
		}
		
		if (this.glitch_time >= this.glitch_time_limit){
			this.glitch_time = 0;
			
			this.glitch_index++;
			if (this.glitch_index >= this.glitch_sequence.length){
				this.glitch_index = 0;
			}
			
			Glitch.TransformPlayer(this, this.glitch_sequence[this.glitch_index]);
			this.glitch_type = this.glitch_sequence[this.glitch_index];
			if (this.glitch_sequence.length > 1){
				Utils.playSound("switchglitch", master_volume, 0);
			}
		}
	}
}

Room.prototype.TryUpdateRoomIfPlayerOffscreen = function(){
	//OFFSCREEN TOP
	if (this.player.y + this.player.bb <= 0){
		room_manager.room_index_y--;
		if (room_manager.room_index_y < 0) room_manager.room_index_y = room_manager.house_height - 1;
		
		room_manager.ChangeRoom();
		
		room.player.x = this.player.x;
		if (room.player.x <= 8) room.player.x+=8;
		if (room.player.x >= room.MAP_WIDTH * Tile.WIDTH -8) room.player.x -= 8;
		room.player.y = room.MAP_HEIGHT * Tile.HEIGHT - Tile.HEIGHT - room.player.bb;
	}
	//OFFSCREEN BOTTOM
	else if (this.player.y + this.player.tb >= (this.MAP_HEIGHT * Tile.HEIGHT)){
		room_manager.room_index_y++;
		if (room_manager.room_index_y >= room_manager.house_height) room_manager.room_index_y = 0;
		
		room_manager.ChangeRoom();
		
		room.player.x = this.player.x;
		if (room.player.x <= 8) room.player.x+=8;
		if (room.player.x >= room.MAP_WIDTH * Tile.WIDTH -8) room.player.x -= 8;
		room.player.y = 0 + Tile.HEIGHT/2 + room.player.tb;
	}
	
	//OFFSCREEN LEFT
	if (this.player.x <= 0){
		room_manager.room_index_x--;
		if (room_manager.room_index_x < 0) room_manager.room_index_x = room_manager.house_width - 1;
		
		room.player.facing = Facing.LEFT;
		room_manager.ChangeRoom();
		
		room.player.y = this.player.y;
		room.player.x = room.MAP_WIDTH * Tile.WIDTH - Tile.WIDTH/2 - room.player.rb;
	}
	//OFFSCREEN RIGHT
	else if (this.player.x + Tile.WIDTH >= (this.MAP_WIDTH * Tile.WIDTH)){
		room_manager.room_index_x++;
		if (room_manager.room_index_x >= room_manager.house_width) room_manager.room_index_x = 0;
		
		room.player.facing = Facing.RIGHT;
		room_manager.ChangeRoom();
		
		room.player.y = this.player.y;
		room.player.x = 0 + Tile.WIDTH/2 - room.player.lb;
	}
	
	if (level_edit) $("house_coordinates").innerHTML = room_manager.room_index_x + " " + room_manager.room_index_y;
}

Room.prototype.Speak = function(text, speech_time){
	this.spoken_text = text;
	this.speech_time = 0;
	this.speech_time_limit = speech_time || 240;
}

Room.prototype.RenderSpeech = function(ctx){
	var speech_height = 32;

	if (this.spoken_text != null && this.spoken_text.length > 0){
		this.speech_timer+=(delta/DNUM);
		if (this.speech_timer > this.speech_time_limit){
			this.speech_timer = 0;
			this.Speak(null);
			return;
		}
		
		var h = 0;
		if (this.player.y+(this.player.bb/2) >= GAME_HEIGHT/2) 
			h = (-1)*(GAME_HEIGHT/1.5)+Tile.HEIGHT;
		
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(Tile.WIDTH, h + GAME_HEIGHT-(Tile.HEIGHT)-speech_height, GAME_WIDTH-(Tile.WIDTH*2), speech_height);
		ctx.fillStyle = "#000000";
		ctx.fillRect(Tile.WIDTH+2, h + GAME_HEIGHT-(Tile.HEIGHT)-speech_height+2, GAME_WIDTH-(Tile.WIDTH*2)-4, speech_height-4);
	
		var fs = 8;
		ctx.font = fs + "px pixelFont";
		ctx.fillStyle = "#ffffff";
		ctx.strokeStyle = "#ffffff";
		var texts = this.spoken_text.split("\n");
		for (var i = 0; i < texts.length; i++){
			if (!(/^((?!chrome).)*safari/i.test(navigator.userAgent))){
				ctx.fillText(texts[i], Tile.WIDTH*2, h + (fs*i)+GAME_HEIGHT+(Tile.HEIGHT/2)-speech_height, GAME_WIDTH-(Tile.WIDTH*2), fs);
			}else if (check_textRenderContext(ctx)){
				ctx.strokeText(texts[i], Tile.WIDTH*2, h + (fs*i)+GAME_HEIGHT+(Tile.HEIGHT/2)-speech_height - 8, fs-2);
			}
		}
	}
}

Room.prototype.Render = function(ctx, level_edit){
	//SORT ENTITIES BY Z INDEX (descending)
	var entities = this.entities.slice(0);
	entities.push(this.player);
	entities.sort(GameObject.ZIndexSort);
	var index = 0;

	//DRAW ENTITIES WITH Z INDEX GREATER THAN 10 UNDER TILES
	while (entities[index].z_index > 10){
		entities[index].Render(ctx, this.camera);
		index++;
	}
	
	//Draw some background code for aesthetic
	var fs = 4;
	ctx.font = fs + "px monospace";
	ctx.fillStyle = "#ffffff";
	ctx.strokeStyle = "#ffffff";
	var texts = this.bg_code.split("\n");
	if (!(/^((?!chrome).)*safari/i.test(navigator.userAgent))){
		for (var i = 0; i < texts.length; i++){
			ctx.fillText(texts[i], 16, fs*i, GAME_WIDTH-32, fs*i);
		}
	}else if (check_textRenderContext(ctx)){
		for (var i = 0; i < texts.length; i++){
			ctx.strokeText(texts[i], 16, fs*i-8, fs);
		}
	}

	//DRAW THE TILES OF THE ROOM
	var tile_img = resource_manager[this.tilesheet_name];
	for (var i = 0; i < this.MAP_HEIGHT; i++){ for (var j = 0; j < this.MAP_WIDTH; j++){
		this.tiles[i][j].Render(ctx, this.camera, tile_img);
	} }
	if (level_edit) DrawLevelEditGrid(ctx, this);
	
	//DRAW THE REMAINING ENTITIES
	for (var i = index; i < entities.length; i++){
		entities[i].Render(ctx, this.camera);
	}
	
	this.RenderSpeech(ctx);
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
	if (this.MAP_HEIGHT * Tile.HEIGHT < this.SCREEN_HEIGHT)
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
	//console.log("NEW WIDTH: ", this.MAP_WIDTH);
	//console.log("NEW HEIGHT: ", this.MAP_HEIGHT);
}

Room.prototype.GetDoor = function(door_id, door){
	for (var i = 0; i < this.entities.length; i++){
		if (this.entities[i].type === "Door"){
			if (this.entities[i].door_id == door_id && this.entities[i] !== door)
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
		width: this.MAP_WIDTH*Tile.WIDTH
		,height: this.MAP_HEIGHT*Tile.HEIGHT
		,glitch_type: this.glitch_type
		,glitch_sequence: this.glitch_sequence
		,glitch_time_limit: this.glitch_time_limit
		,can_use_spellbook: this.can_use_spellbook
		,player: {type: "Player", obj: this.player.Export()}
		,entities: entities
		,tiles: tiles
		,bg_code: this.bg_code
	};
}

Room.ImportAsync = function(file_name, callback){
	readTextFileAsync(file_name, function(obj_str){
		var room = new Room();
		if (obj_str !== null && obj_str !== ""){
			room.Import(JSON.parse(obj_str));
		}
		callback(room);
	});
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
	this.ChangeSize(room.width, room.height);
	this.player = new Player(); this.player.Import(room.player.obj);
	this.glitch_index = 0;
	this.glitch_time = 0;
	this.glitch_time_limit = room.glitch_time_limit || Room.GLITCH_TIME_LIMIT_ORIGINAL;
	this.glitch_sequence = room.glitch_sequence || [room.glitch_type];
	this.glitch_type = this.glitch_sequence[0];
	this.can_use_spellbook = defaultValue(room.can_use_spellbook, true);
	Glitch.TransformPlayer(this, this.glitch_type);
	
	//import entities
	this.entities = [new Hat(this.player.x, this.player.y-8)];
	if (room.entities){
		for (var i = 0; i < room.entities.length; i++){
      // I don't think this would work with classes... 
      // https://stackoverflow.com/questions/496961/call-a-javascript-function-name-using-a-string
			var entity = new window[room.entities[i].type]();
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
			var tile = new Tile(j*Tile.WIDTH, i*Tile.HEIGHT); tile.Import(room.tiles[i][j]);
			row.push(tile);
		}
		this.tiles.push(row);
	}
	
	this.bg_code = room.bg_code;
	if (this.bg_code === undefined) this.bg_code = "";
}