function Slope(){}
Slope.FLAT = 0;
Slope.LOW_POS = (Math.PI / 6);
Slope.MID_POS = (Math.PI / 4);
Slope.HI_POS = (Math.PI / 3);
Slope.LOW_NEG = -30;
Slope.MID_NEG = -45;
Slope.HI_NEG = -60;


Tile.WIDTH = 8;
Tile.HEIGHT = 8;

Tile.GHOST = -1;
Tile.SOLID = 0;
Tile.FALLTHROUGH = 1;
Tile.KILL_PLAYER = 2;
Tile.SUPER_SOLID = 3;

function Tile(x, y, collision, slope){
	GameObject.call(this, x, y, 0, 0, Tile.WIDTH, Tile.HEIGHT);
	this.type = "Tile";
	this.collision = defaultValue(collision, Tile.GHOST);
	if (collision == Tile.KILL_PLAYER) this.kill_player = true;
	this.slope = slope;
	this.tileset_x = 0;
	this.tileset_y = 0;
	
	this.SetLRHeights();
}
extend(GameObject, Tile);

Tile.prototype.Import = function(obj){
	//GameObject.prototype.Import.call(this, obj);
	this.collision = obj.collision;
	this.slope = obj.slope;
	this.SetLRHeights();
	
	this.tileset_x = obj.tileset_x;
	this.tileset_y = obj.tileset_y;
}
Tile.prototype.Export = function(){
	//var obj = GameObject.prototype.Export.call(this);
	obj = {};
	obj.collision = this.collision;
	obj.slope = this.slope;
	
	obj.tileset_x = this.tileset_x;
	obj.tileset_y = this.tileset_y;
	return obj;
}

Tile.prototype.SetLRHeights = function(){
	//default to flat
	switch (this.slope){
		case Slope.LOW_POS: case Slope.MID_POS: case Slope.HI_POS:
			this.l_height = Tile.HEIGHT;
			this.r_height = Tile.HEIGHT - (Math.tan(slope) * Tile.WIDTH);
			break;
		case Slope.LOW_NEG: case Slope.MID_NEG: case Slope.HI_NEG:
			this.l_height = Tile.HEIGHT - (Math.tan(slope) * Tile.WIDTH);
			this.r_height = Tile.HEIGHT;
			break;
		case Slope.FLAT:
			this.l_height = 0;
			this.r_height = 0;
		default: break;
	}
}

Tile.prototype.Render = function(ctx, camera, image){
	if (image === null || (this.tileset_x == 0 && this.tileset_y == 0)) return;
	var row = this.tileset_y;
	var column = this.tileset_x;
	
	ctx.drawImage(image, 
		//SOURCE RECTANGLE
		Tile.WIDTH * column, Tile.HEIGHT * row, Tile.WIDTH, Tile.HEIGHT,
		//DESTINATION RECTANGLE
		~~(this.x-camera.x+camera.screen_offset_x+0.5), 
		~~(this.y-camera.y+camera.screen_offset_y+0.5),
		Tile.WIDTH, Tile.HEIGHT
	);
}