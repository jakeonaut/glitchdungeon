function GameObject(x, y, lb, tb, rb, bb){
	this.type = "GameObject";
	this.x = x;
	this.y = y;
	this.lb = lb;
	this.tb = tb;
	this.rb = rb;
	this.bb = bb;
	this.width = rb - lb;
	this.height = bb - tb;
	this.solid = false;
	this.delete_me = false;
}

GameObject.prototype.Import = function(obj){
	this.x = obj.x;
	this.y = obj.y;
	this.lb = obj.lb;
	this.tb = obj.tb;
	this.rb = obj.rb;
	this.bb = obj.bb;
}
GameObject.prototype.Export = function(){
	return {
		x: this.x,
		y: this.y,
		lb: this.lb,
		tb: this.tb,
		rb: this.rb,
		bb: this.bb
	};
}
GameObject.prototype.Update = function(delta, map){}
GameObject.prototype.Render = function(ctx){}

/**************************COLLISION DETECTION*************************************/
//object is of type GameObject
GameObject.prototype.IsColliding = function(object){
	return this.IsRectColliding(object, this.x+this.lb, this.y+this.tb, 
		this.x+this.rb, this.y+this.bb);
}

GameObject.prototype.IsRectColliding = function(object, lb,tb,rb,bb){
  if (lb <= object.x + object.rb && rb >= object.x + object.lb &&
      tb <= object.y + object.bb && bb >= object.y + object.tb)
    return true;
  return false;
}

GameObject.prototype.ReturnCollidingObjects = function(objects){
	var colliding_objects = [];
	for (var i = 0; i < objects.length; i++){
		if (this.IsColliding(objects[i])){
			colliding_objects.push(objects[i]);
		}
	}
	return colliding_objects;
}