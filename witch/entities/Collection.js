function Collection(x, y, collection_id){
	GameMover.call(this, x, y, 2, 2, 14, 16, "collection_sheet");
	this.type = "Collection";
	this.collection_id = collection_id;
	this.animation.frame_delay = 30;
	
	var ani_x = Math.floor(this.collection_id / 6) * 2;
	var ani_y = this.collection_id % 6;
	this.animation.Change(ani_x, ani_y, 2);
}
Collection.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
	this.collection_id = obj.collection_id;
	
	var ani_x = Math.floor(this.collection_id / 6) * 2;
	var ani_y = this.collection_id % 6;
	this.animation.Change(ani_x, ani_y, 2);
}

Collection.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.collection_id = this.collection_id;
	return obj;
}
extend(GameMover, Collection);

Collection.prototype.UpdateAnimationFromState = function(){
}