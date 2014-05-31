function Slope(){}
Slope.FLAT = 0;
Slope.LOW_POS = (Math.PI / 6);
Slope.MID_POS = (Math.PI / 4);
Slope.HI_POS = (Math.PI / 3);
Slope.LOW_NEG = -30;
Slope.MID_NEG = -45;
Slope.HI_NEG = -60;

Tile.GHOST = -1;
Tile.SOLID = 0;
Tile.FALLTHROUGH = 1;

function Tile(x, y, collision, slope){
	GameObject.call(this, x, y, 0, 0, Tile.WIDTH, Tile.HEIGHT);
	this.type = "Tile";
	this.collision = defaultValue(collision, Tile.GHOST);
	this.slope = slope;
	
	this.SetLRHeights();
}
extend(GameObject, Tile);

Tile.prototype.Import = function(obj){
	GameObject.prototype.Import.call(this, obj);
	this.collision = obj.collision;
	this.slope = obj.slope;
	this.SetLRHeights();
}
Tile.prototype.Export = function(){
	var obj = GameObject.prototype.Export.call(this);
	obj.collision = this.collision;
	obj.slope = this.slope;
	return obj;
}

Tile.prototype.Render = function(ctx, camera){
	switch (this.collision){
		case Tile.SOLID:
			ctx.fillStyle="#FF00FF";
			break;
		case Tile.FALLTHROUGH:
			ctx.fillStyle="#00FFFF";
			break;
		default: return; break;
	}
	ctx.fillRect(this.x - camera.x + camera.screen_offset_x, this.y - camera.y + camera.screen_offset_y, Tile.WIDTH, Tile.HEIGHT);
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

Tile.WIDTH = 8;
Tile.HEIGHT = 8;