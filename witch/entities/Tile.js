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
	this.collision = defaultValue(collision, Tile.GHOST);
	this.slope = slope;
	
	//default to flat
	switch (slope){
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
//Inheritance
Tile.prototype = Object.create(GameObject.prototype);

Tile.prototype.Render = function(ctx){
	switch (this.collision){
		case Tile.SOLID:
			ctx.fillStyle="#FF00FF";
			break;
		case Tile.FALLTHROUGH:
			ctx.fillStyle="#00FFFF";
			break;
		default: return; break;
	}
	ctx.fillRect(this.x, this.y, Tile.WIDTH, Tile.HEIGHT);
}

Tile.WIDTH = 8;
Tile.HEIGHT = 8;