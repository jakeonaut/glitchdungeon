var img_path = "witch/assets/images/";
var snd_path = "witch/assets/sounds/";

//Display the loading screen while everything else is loading...
function ResourceManager(){
	//IMAGE VARIABLE DECLARATION
	this.images_loaded = 0;
	this.image_names = [
		"bg_image",
		"player_grey_sheet",
		"player_red_sheet",
		"player_green_sheet",
		"player_blue_sheet",
		"player_zero_sheet",
		"npc_sheet",
		"obj_sheet",
		"grey_tile_sheet",
		"red_tile_sheet",
		"green_tile_sheet",
		"blue_tile_sheet",
		"zero_tile_sheet"
	];
	this.num_images = this.image_names.length;
	
	//SOUND VARIABLE DECLARATION
	this.sounds_loaded = 0;
	this.sound_names = [
	]
	this.num_sounds = this.sound_names.length;
}

ResourceManager.prototype.DisplayLoadScreen = function(){
	ctx.canvas.width = GAME_WIDTH*VIEW_SCALE;
	ctx.canvas.height = GAME_HEIGHT*VIEW_SCALE;
	ctx.scale(VIEW_SCALE,VIEW_SCALE);
	
	//Display the LOADING... screen
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
	
	ctx.fillStyle = "rgb(255,255,255)";
	//ctx.font = "24px pixelFont";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("LOADING...", 134, GAME_HEIGHT/2-4);
}

ResourceManager.prototype.ImageLoad = function(){ 
	this.images_loaded++;
	this.CheckLoadedResources(); 
}
ResourceManager.prototype.SoundLoad = function(){ 
	this.sounds_loaded++; 
	this.CheckLoadedResources(); 
}

//LOAD ALL THE RESOURCES
ResourceManager.prototype.LoadResources = function(ctx){
	this.DisplayLoadScreen(ctx);

	//Load Images
	for (var i = 0; i < this.image_names.length; i++){
		var img = this.image_names[i];
		this[img] = new Image();
		this[img].onload = this.ImageLoad.bind(this);
		this[img].src = img_path + img + ".png";
	}
	
	//Load Sounds
	for (var i = 0; i < this.sound_names.length; i++){
		var snd = this.sound_names[i];
		this[snd] = document.createElement("audio");
		this[snd].oncanplaythrough = this.SoundLoad.bind(this);
		this[snd].src = snd_path + snd + ".mp3";
	}
}

ResourceManager.prototype.CheckLoadedResources = function(){
	if (this.images_loaded >= this.num_images && this.sounds_loaded >= this.num_sounds){
		startGame();
	}
}