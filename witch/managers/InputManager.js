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
	
	//GLITCH MANAGEMENT
	/*if (this.key_manager.keys_pressed[KeyManager.SPACE]){
		player.SwitchToGlitch(0);
	}
	else if (this.key_manager.keys_pressed[KeyManager.Q]){
		player.SwitchToGlitch(1);
	}
	else if (this.key_manager.keys_pressed[KeyManager.W]){
		player.SwitchToGlitch(2);
	}
	else if (this.key_manager.keys_pressed[KeyManager.E]){
		player.SwitchToGlitch(3);
	}
	else if (this.key_manager.keys_pressed[KeyManager.R]){
		player.SwitchToGlitch(4);
	}
	else if (this.key_manager.keys_pressed[KeyManager.A]){
		player.SwitchGlitchLeft();
	}
	else if (this.key_manager.keys_pressed[KeyManager.S]){
		player.SwitchGlitchRight();
	}*/
}