function Slope(){}
Slope.FLAT = 0;
Slope.LOW_POS = (Math.PI / 6);
Slope.MID_POS = (Math.PI / 4);
Slope.HI_POS = (Math.PI / 3);
Slope.LOW_NEG = -30;
Slope.MID_NEG = -45;
Slope.HI_NEG = -60;

function Tile(x, y, slope, fallthrough){
	GameObject.call(this, x, y, 0, 0, Tile.WIDTH, Tile.HEIGHT);
	this.solid = true;
	this.fallthrough = defaultValue(fallthrough, false);
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
GameSprite.prototype = Object.create(GameObject.prototype);

Tile.WIDTH = 8;
Tile.HEIGHT = 8;