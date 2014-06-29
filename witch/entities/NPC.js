function NPC(x, y, npc_id){
	GameMover.call(this, x, y, 2, 2, 14, 16, "npc_sheet");
	this.type = "NPC";
	this.npc_id = npc_id;
	this.animation.frame_delay = 30;
}
NPC.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
	this.npc_id = obj.npc_id;
}

NPC.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.npc_id = this.npc_id;
	return obj;
}
extend(GameMover, NPC);

NPC.prototype.Update = function(delta, map){
	GameMover.prototype.Update.call(this, delta, map);
	
	var d = 16;
	var dy = 8;
	var px = map.player.x + (map.player.rb/2);
	if (map.player.y + map.player.bb > this.y - dy && map.player.y < this.y + this.bb + dy){
		if (px < this.x + this.lb && px > this.x + this.lb - d){
			this.facing = Facing.LEFT;
		}
		if (px > this.x + this.rb && px < this.x + this.rb + d){
			this.facing = Facing.RIGHT;
		}
	}
	
	
	//TALK TO PLAYER AND SUCH
	if (this.IsRectColliding(map.player, this.x+this.lb-Tile.WIDTH, this.y+this.tb, this.x+this.rb+Tile.WIDTH, this.y+this.bb)){
		this.talking = true;
		if (this.npc_id != 19)
			room.Speak("NPC: "+this.GetText());
		else room.Speak(this.GetText());
	}
	else if (this.talking){
		this.talking = false;
		room.Speak(null);
	}
}

NPC.prototype.UpdateAnimationFromState = function(){
	var ani_x = 0;//this.npc_id / 2;
	var ani_y = 0;//this.npc_id % 2;
	this.animation.Change(ani_x, ani_y, 2);
	
	if (this.facing === Facing.LEFT){
		this.animation.abs_ani_y = 2 * this.animation.frame_height;
	}else if (this.facing === Facing.RIGHT){
		this.animation.abs_ani_y = 0;
	}
	this.prev_move_state = this.move_state;
}

//TEXT BABY
NPC.prototype.GetText = function(){
	switch (this.npc_id){
		case -1:
			return "hold up to jump higher\n\nthere is no escape";
		case 0:
			return "you must escape\n the labyrinth\nuse arrow keys";
		case 1:
			return "press down to fall\n and to enter doors";
		case 2:
			return "when red, you can\nwalk off cliffs\nwithout falling";
		case 3:
			return "press space bar\n to cast a spell";
		case 4:
			return "press down to\nplace a memory";
		case 5:
			return "are we free now?";
		case 6:
			return "dying revives you to\nlast checkpoint\ni'm sorry";
		case 7:
			return "remember your wits\n\ndeath is inevitable";
		case 8:
			return "don't afraid of\nfailure\nits all there is";
		case 9:
			return "magick controls\nthe dungeon";
		case 10:
			return "GET\nwitch/rooms/rooms/room_4_5.txt\n404 (File not found)";
		case 11:
			return "patience is a virtue\n\nthat means nothing here";
		case 12:
			return "give up your hope\nbefore you lose it";
		case 13:
			return "there is no real escape";
		case 14:
			return "i believe in you";
		case 15:
			return "nice of you to stop by\nthis is the wrong way";
		case 16:
			return "you escaped!\ncongratulations!";
		case 17:
			return "we knew you could do it!\nwell i did at least";
		case 18:
			return "hip hip hooray!\nyay!!\nyou're the best!";
		case 19:
			return 	"deaths: " + room_manager.num_deaths + "\n" +
					"spells cast: " + room_manager.spells_cast + "\n" +
					"time: " + room_manager.time + " s";
		case 20:
			InputManager.RestartGame = function(){
				room_manager = new House();
				room = room_manager.GetRoom();

				console.log("start");
				//Let's play the game!
				then = Date.now();
				
				InputManager.RestartGame = function(){}
			}
			return "thanks for playing :)!\n\npress enter to restart";
		default:
			break;
	}
}