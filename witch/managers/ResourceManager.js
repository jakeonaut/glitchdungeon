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
		"player_cyan_sheet",
		"player_gold_sheet",
		"player_pink_sheet",
		"player_zero_sheet",
		"npc_sheet",
		"enemy_sheet",
		"collection_sheet",
		"obj_sheet",
		"tile_grey_sheet",
		"tile_red_sheet",
		"tile_green_sheet",
		"tile_blue_sheet",
		"tile_cyan_sheet",
		"tile_gold_sheet",
		"tile_pink_sheet",
		"tile_zero_sheet"
	];
	this.num_images = this.image_names.length;
	
	//SOUND VARIABLE DECLARATION
	this.play_sound = true;
	this.audio_context;
	try{
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		this.audio_context = new AudioContext();
	}catch(e){
		this.audio_context = null;
		this.play_sound = false;
	}
	this.sounds_loaded = 0;
	this.sound_names = [
		"RoccoW_outOfSight"
		,"jump"
		,"land"
		,"pickup"
		,"checkpoint"
		,"hurt"
		,"LA_Stairs"
		,"LA_Chest_Open"
		,"locked"
		,"switchglitch"
	];
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
		this.loadBuffer(snd_path + snd + ".mp3", snd);
	}
}

ResourceManager.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.audio_context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader[index] = buffer;
		loader.SoundLoad();
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

ResourceManager.prototype.CheckLoadedResources = function(){
	if (this.images_loaded >= this.num_images && this.sounds_loaded >= this.num_sounds){
		startGame();
	}
}