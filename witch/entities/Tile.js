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
	GameSprite.call(this, x, y, 0, 0, Tile.WIDTH, Tile.HEIGHT, "tileset_sheet");
	this.type = "Tile";
	this.collision = defaultValue(collision, Tile.GHOST);
	this.animation.frame_width = 8;
	this.animation.frame_height = 8;
	this.animation.rel_ani_x = 0;
	this.animation.rel_ani_y = 0;
	this.slope = slope;
	
	this.SetLRHeights();
}
extend(GameSprite, Tile);

Tile.prototype.Import = function(obj){
	GameSprite.prototype.Import.call(this, obj);
	this.collision = obj.collision;
	this.slope = obj.slope;
	this.SetLRHeights();
	
	this.animation.rel_ani_x = obj.animation_rel_ani_x;
	this.animation.rel_ani_y = obj.animation_rel_ani_y;
}
Tile.prototype.Export = function(){
	var obj = GameSprite.prototype.Export.call(this);
	obj.collision = this.collision;
	obj.slope = this.slope;
	
	obj.animation_rel_ani_x = this.animation.rel_ani_x;
	obj.animation_rel_ani_y = this.animation.rel_ani_y;
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

Tile.WIDTH = 8;
Tile.HEIGHT = 8;