function InputManager(key_manager){
	this.key_manager = key_manager;
}

InputManager.prototype.Update = function(player){
//	console.log(this.key_manager.keys_down);
	if (this.key_manager.keys_down[KeyManager.RIGHT]){
		player.MoveRight();
	}
	else if (this.key_manager.keys_down[KeyManager.LEFT]){
		player.MoveLeft();
	}
	
	if (this.key_manager.keys_pressed[KeyManager.UP]){
		player.StartJump();
	}
	else if (this.key_manager.keys_down[KeyManager.UP]){
		player.Jump();
	}
	if (this.key_manager.keys_up[KeyManager.UP]){
		player.StopJump();
	}
	
	if (this.key_manager.keys_pressed[KeyManager.DOWN]){
		player.PressDown();
	}
	else if(this.key_manager.keys_up[KeyManager.DOWN]){
		player.StopPressingDown();
	}
	
	if (this.key_manager.keys_pressed[KeyManager.SPACE]){
		room_manager.RevivePlayer();
	}
}