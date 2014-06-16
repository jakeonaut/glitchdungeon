function GameObject(x, y, lb, tb, rb, bb){
	this.type = "GameObject";
	this.x = x;
	this.y = y;
	this.original_x = x;
	this.original_y = y;
	this.lb = lb;
	this.tb = tb;
	this.rb = rb;
	this.bb = bb;
	this.width = rb - lb;
	this.height = bb - tb;
	this.delete_me = false;
	
	this.kill_player = false;
}

GameObject.prototype.Import = function(obj){
	this.x = obj.x;
	this.y = obj.y;
	this.original_x = obj.x;
	this.original_y = obj.y;
	this.lb = obj.lb;
	this.tb = obj.tb;
	this.rb = obj.rb;
	this.bb = obj.bb;
	this.kill_player = obj.kill_player || false;
}
GameObject.prototype.Export = function(){
	return {
		x: this.x,
		y: this.y,
		lb: this.lb,
		tb: this.tb,
		rb: this.rb,
		bb: this.bb,
		kill_player: this.kill_player
	};
}
GameObject.prototype.ResetPosition = function(){
	this.x = this.original_x;
	this.y = this.original_y;
}
GameObject.prototype.Update = function(delta, map){}
GameObject.prototype.Render = function(ctx, camera){}

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

GameObject.prototype.IsPointColliding = function(x, y){
  if (x <= this.x + this.rb && x >= this.x + this.lb &&
      y <= this.y + this.bb && y >= this.y + this.tb)
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