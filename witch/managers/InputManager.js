function InputManager(key_manager){
	this.key_manager = key_manager;
}

InputManager.prototype.Update = function(player){
//	console.log(this.key_manager.keys_down);
	if (this.key_manager.keys_down[KeyManager.LEFT]){
		player.MoveLeft();
	}
	if (this.key_manager.keys_down[KeyManager.RIGHT]){
		player.MoveRight();
	}
	
	if (this.key_manager.keys_pressed[KeyManager.UP]){
		player.Jump();
	}
}