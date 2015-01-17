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
	
	if (this.key_manager.keys_pressed[KeyManager.UP] || this.key_manager.keys_pressed[KeyManager.Z]){
		player.StartJump();
	}
	else if (this.key_manager.keys_down[KeyManager.UP] || this.key_manager.keys_down[KeyManager.Z]){
		player.Jump();
	}
	if (this.key_manager.keys_up[KeyManager.UP] || this.key_manager.keys_up[KeyManager.Z]){
		player.StopJump();
	}
	
	if (this.key_manager.keys_pressed[KeyManager.DOWN]){
		player.PressDown();
	}
	else if(this.key_manager.keys_up[KeyManager.DOWN]){
		player.StopPressingDown();
	}
	
	if (this.key_manager.keys_pressed[KeyManager.SPACE] && room_manager.has_spellbook){
		//if (player.on_ground){
			room_manager.RandomGlitch();
		//}
	}
	
	if (this.key_manager.keys_pressed[KeyManager.DEL]){
		if (bg_name !== "RoccoW_iveGotNothing")
			player.Die();
	}
	
	if (this.key_manager.keys_pressed[KeyManager.H]){
		room_manager.beat_game = !room_manager.beat_game;
		if (room_manager.beat_game)
			Utils.playSound("pickup", master_volume, 0);
		else Utils.playSound("error", master_volume, 0);
	}
	
	for (var i = 0; i < KeyManager.NUMBERS.length; i++){
		if (this.key_manager.keys_pressed[KeyManager.NUMBERS[i]] && room_manager.has_spellbook && room_manager.spellbook.length > i){
			var temp = room_manager.glitch_index;
			room_manager.glitch_index = i-1;
			room_manager.RandomGlitch();
			if (room_manager.glitch_index === i-1)
				room_manager.glitch_index = temp;
		}
	}
	
	if (this.key_manager.keys_pressed[KeyManager.A] && room_manager.has_spellbook){
		room_manager.glitch_index-=2;
		if (room_manager.glitch_index < 0)
			room_manager.glitch_index = room_manager.spellbook.length + room_manager.glitch_index;
		room_manager.RandomGlitch();
	}
	if (this.key_manager.keys_pressed[KeyManager.S] && room_manager.has_spellbook){
		room_manager.RandomGlitch();
	}
	
	
	//Restart the game
	if ((this.key_manager.keys_pressed[KeyManager.SHIFT] && this.key_manager.keys_down[KeyManager.R]) || (this.key_manager.keys_down[KeyManager.SHIFT] && this.key_manager.keys_pressed[KeyManager.R])){
		InputManager.RestartGame();
	}
}

InputManager.RestartGame = function(){
	room_manager.Restart();
	room = room_manager.GetRoom();

	console.log("start");
	//Let's play the game!
	then = Date.now();
	
	bg_name = "RoccoW_outOfSight";
	if (resource_manager.play_music){
		stopMusic();
		startMusic();
	}
	
	//InputManager.RestartGame = function(){}
}