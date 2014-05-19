var isMSIE = /*@cc_on!@*/0;
var playSound = true;

if (isMSIE){
  playSound = false; 
}

if (navigator.userAgent.match(/AppleWebKit/) && !navigator.userAgent.match(/Chrome/)) {
   playSound = false;
}

var GAME_WIDTH=320;
var GAME_HEIGHT=300;

var canvas;
var ctx;

//primitive variables
var then;
var viewScale = 2;
var fontColor = "rgb(0,0,0)"

//managers
var key_manager;
var resoure_manager;
var map_manager;

//object variables
var player;

/*var solids = new Array();
solids[0] = new Solid(GAME_WIDTH, 60, 16, GAME_HEIGHT);
solids[1] = new Solid(0, 44, GAME_WIDTH, 16);
solids[2] = new Solid(-16, 60, 16, GAME_HEIGHT);
solids[3] = new Solid(0, GAME_HEIGHT, GAME_WIDTH, 16);*/

function createEntities(){
	map_manager = new MapManager();

	player = new Player(GAME_WIDTH/2, GAME_HEIGHT/2, resource_manager.player_sheet);
}

var init = function(){
	console.log("init");
	
	canvas = document.getElementById("game_canvas");
	canvas.tabIndex = 1;
	canvas.width = GAME_WIDTH;
	canvas.height = GAME_HEIGHT;
	ctx = canvas.getContext("2d");
	
	//Handle keyboard controls
	key_manager = new KeyManager();
	addEventListener("keydown", key_manager.KeyDown.bind(key_manager), false);
	addEventListener("keyup", key_manager.KeyUp.bind(key_manager), false);
	
	//When load resources is finished, it will trigger startGame
	resource_manager = new ResourceManager();
	resource_manager.LoadResources(ctx);
};

var startGame = function(){
	createEntities();

	console.log("start");
	//Let's play the game!
	then = Date.now();
	//setInterval(main,17); //Execute as fast as possible!!!
	main();
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
	key_manager.ForgetKeysPressed();
    player.Update(delta/1000, map_manager);
};

var render = function(){
	ctx.canvas.width = GAME_WIDTH*viewScale;
	ctx.canvas.height = GAME_HEIGHT*viewScale;
	ctx.scale(viewScale,viewScale);
	
	//Erase screen
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
	
	//draw the game
	ctx.drawImage(resource_manager.bg_image, 0, 0, 640, 480, 0, 60, 320, 240);
	player.Render(ctx);
};

window.onload=init;
