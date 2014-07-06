var level_edit = false;
var master_volume = 0.5;
var delta = 18; //this is a little hacky.
var DNUM = 18;

var bg_music = null;
var bg_name = "RoccoW_outOfSight";
var tryToPlay = null;

var GAME_WIDTH=160; //CHANGE TO /2
var GAME_HEIGHT=120; //CHANGE TO /2
var VIEW_SCALE = 4; //CHANGE TO *2

var canvas;
var ctx;

//primitive variables
var game_started = false;
var then;
var fontColor = "rgb(0,0,0)"

//managers
var room_manager;
var key_manager;
var input_manager;
var resource_manager;

var room;

var init = function(){
	console.log("init");
	
	canvas = $("game_canvas");
	canvas.tabIndex = 1;
	canvas.width = GAME_WIDTH;
	canvas.height = GAME_HEIGHT;
	ctx = canvas.getContext("2d");
	
	//Handle keyboard controls
	key_manager = new KeyManager();
	window.onkeydown = key_manager.KeyDown.bind(key_manager);
	window.onkeyup = key_manager.KeyUp.bind(key_manager);
	if (level_edit){
		canvas.onmousedown = function(e){LevelEditMouseDown(e); SoundMouseDown(e)}
		canvas.onmousemove = LevelEditMouseMove;
		canvas.onmouseup = function(e){ LevelEditMouseUp(e); SoundMouseUp(e); }
		$("tileset_canvas").onmousedown = TileSetMouseDown;
	}else{
		canvas.onmousedown = SoundMouseDown;
		canvas.onmouseup = SoundMouseUp;
	}
	
	input_manager = new InputManager(key_manager);
	if (level_edit) InitLevelEdit();
	
	//When load resources is finished, it will trigger startGame
	resource_manager = new ResourceManager();
	resource_manager.LoadResources(ctx);
};

var startGame = function(){
	if (game_started) return;
	game_started = true;

	room_manager = new House();
	room = room_manager.GetRoom();

	console.log("start");
	//Let's play the game!
	then = Date.now();
	
	bg_name = "RoccoW_outOfSight";
	stopMusic();
	startMusic();
	setInterval(main, 17);
};

var stopSound = function(){
	resource_manager.play_sound = false;
}

var startSound = function(){
	if (!resource_manager.can_play_sound) return;
	resource_manager.play_sound = true;
}

var stopMusic = function(){
	resource_manager.play_music = false;
	window.clearInterval(tryToPlay);
	tryToPlay = null;
	if (bg_music !== null && bg_music !== undefined){
		bg_music.stop();
		bg_music = null;
	}
}

var startMusic = function(){
	if (!resource_manager.can_play_sound) return;
	resource_manager.play_music = true;

	if (bg_name !== null && bg_name !== undefined){
		bg_music = Utils.playSound(bg_name, master_volume, 0, true);
	}
}

var SoundMouseDown = function(){
}

var SoundMouseUp = function(e){
	var box = canvas.getBoundingClientRect();
	
	var x = (e.clientX - box.left) / 2;
	var y = (e.clientY - box.top) / 2;
	
	if (x >= 4 && x <= 20){
		if (y >= 4 && y <= 20){
			if (resource_manager.play_music){
				stopMusic();
			}else if (resource_manager.can_play_sound){
				startMusic();
			}
		}
		
		else if (y >= 24 && y <= 40){
			if (resource_manager.play_sound){
				stopSound();
			}else if (resource_manager.can_play_sound){
				startSound();
			}
		}
	}
}

//main game loop
var main = function(){
	var now = Date.now();
	//time variable so we can make the speed right no matter how fast the script
    //delta = now - then;
	
	update(delta);
	render();
	then = now;
}

var update = function(delta){
    room.Update(input_manager, delta);
	key_manager.ForgetKeysPressed();
};

var render = function(){
	ctx.canvas.width = GAME_WIDTH*VIEW_SCALE;
	ctx.canvas.height = GAME_HEIGHT*VIEW_SCALE;
	ctx.scale(VIEW_SCALE,VIEW_SCALE);
	
	//Erase screen
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
	
	//draw the game
	sharpen(ctx);
	room.Render(ctx, level_edit);
	
	//draw sound buttons
	var ani_x = 0;
	if (!resource_manager.play_music) ani_x = 16;
	
	ctx.scale(0.5, 0.5);
	ctx.drawImage(resource_manager.soundButtons, 
		//SOURCE RECTANGLE
		ani_x, 0, 16, 16,
		//DESTINATION RECTANGLE
		4, 4, 16, 16
	);
	
	ani_x = 0;
	if (!resource_manager.play_sound) ani_x = 16;
	ctx.drawImage(resource_manager.soundButtons, 
		//SOURCE RECTANGLE
		ani_x, 16, 16, 16,
		//DESTINATION RECTANGLE
		4, 24, 16, 16
	);
};

window.onload=init;

//SECRET TROPHIES!!!
var Trophy = function(){};
Trophy.POWERS = 0;
Trophy.HAT = 1;
Trophy.DEATH = 2;
Trophy.SECRET = 3;
Trophy.GiveTrophy = function(trophy){
	var username = Utils.gup("gjapi_username");
	var user_token = Utils.gup("gjapi_token");
	if (username === null || username === '')
		return;
	console.log(username + ", " + user_token);
	
	//This stuff is contextual to my game jolt game, so 
	//if you're making a game in game jolt, the achievement token
	//for your game should be able to be used here
	var game_id = GJAPI.game_id;

	var url = "http://gamejolt.com/api/game/v1/trophies/add-achieved/?game_id="+game_id+"&username="+username+
				"&user_token="+user_token;
	switch (trophy){
		case Trophy.POWERS:
			url += "&trophy_id=9184";
			console.log("9184");
			break;
		case Trophy.HAT:	
			url += "&trophy_id=9185";
			console.log("9185");
			break;
		case Trophy.DEATH:
			url += "&trophy_id=9187";
			console.log("9187");
			break;
		case Trophy.SECRET:
			url += "&trophy_id=9186";
			console.log("9186");
			break;
		default: break;
	}
	
	//TODO:: BEFORE COMMITTING TO GIT, ADD THIS SOMEWHERE ELSE AND HIDE IT!!!
	var signature = url + GJAPI.private_token;
	signature = md5(signature);
	
	var xmlhttp = new XMLHttpRequest();
	var url = url + "&signature=" + signature;
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}