var level_edit = true;
var master_volume = 0.5;

var GAME_WIDTH=160; //CHANGE TO /2
var GAME_HEIGHT=120; //CHANGE TO /2
var VIEW_SCALE = 4; //CHANGE TO *2

var canvas;
var ctx;

//primitive variables
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
	canvas.onmousedown = LevelEditMouseDown;
	canvas.onmousemove = LevelEditMouseMove;
	canvas.onmouseup = LevelEditMouseUp;
	$("tileset_canvas").onmousedown = TileSetMouseDown;
	
	input_manager = new InputManager(key_manager);
	if (level_edit) InitLevelEdit();
	
	//When load resources is finished, it will trigger startGame
	resource_manager = new ResourceManager();
	resource_manager.LoadResources(ctx);
};

var startGame = function(){
	room_manager = new House();
	room = room_manager.GetRoom();

	console.log("start");
	//Let's play the game!
	then = Date.now();
	
	//Utils.playSound("RoccoW_outOfSight", master_volume, 0);
	setInterval(main, 17);
};

//main game loop
var main = function(){
	var now = Date.now();
	//time variable so we can make the speed right no matter how fast the script
    var delta = now - then;
	
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
};

window.onload=init;