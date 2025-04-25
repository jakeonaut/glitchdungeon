var level_edit = false;
var npc_mode = true;
var master_volume = 0.5;
var delta = 18; //this is a little hacky.
var DNUM = 18;
var FRAME_INTERVAL = 17

var bg_music = null;
var bg_name = "RoccoW_outOfSight";
var tryToPlay = null;
var click_to_start = true;

var GAME_WIDTH=160; //CHANGE TO /2
var GAME_HEIGHT=120; //CHANGE TO /2
var VIEW_SCALE = 4; //CHANGE TO *2

var canvas;
var ctx;

//primitive variables
var game_started = false;
var then;
var fontColor = "rgb(0,0,0)";

//managers
var room_manager;
var key_manager;
var input_manager;
var resource_manager;

var room;

var init = function(){
    if (level_edit) InitLevelEdit();
    // console.log("init");
    
    canvas = $("game_canvas");
    canvas.tabIndex = 1;
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    ctx = canvas.getContext("2d");
    set_textRenderContext(ctx);
    click_to_start = false;
    
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
    
    //When load resources is finished, it will trigger startGame
    setTimeout(function(){
        resource_manager = new ResourceManager();
        resource_manager.LoadResources(ctx);
    }, 1);
};

var startGame = function(){
    if (game_started) return;
    game_started = true;
    bg_name = "RoccoW_outOfSight";

    room_manager = new House(function(){
            room = room_manager.GetRoom();
            
            //Let's play the game!
            // console.log("start");
            then = Date.now();

            stopMusic();
            startMusic();
        
        const username = Utils.gup("gjapi_username");
        if (username != null && username !== '') {
            Utils.gup("gjapi_token");
        }
        requestAnimationFrame(() => gameLoop(FRAME_INTERVAL))
    }.bind(this));
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
    click_to_start = true;
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
var gameLoop = function(fpsInterval){

    var now = Date.now();
    var elapsed = now - then
    //time variable so we can make the speed right no matter how fast the script
    // delta = now - then;

    requestAnimationFrame(() => gameLoop(fpsInterval));
    
    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval
        then = now - (elapsed % fpsInterval);
        frames++;

        if (click_to_start){
            update(delta);
            render();
        } else {
            //Erase screen
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, GAME_WIDTH*VIEW_SCALE, GAME_HEIGHT*VIEW_SCALE);
            
            //draw the game
            sharpen(ctx);
            
            ctx.fillStyle = "rgb(255,255,255)";
            //ctx.font = "24px pixelFont";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText("WARNING: FLASHING ITEMS", 134, GAME_HEIGHT/2+25);
            ctx.fillText("SCREEN MAY RAPIDLY CHANGE COLOR", 134, GAME_HEIGHT/2+49);
            ctx.fillText("CLICK TO START", 134, GAME_HEIGHT/2+80);
        }
    }
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

window.onload= function(){setTimeout(init, 0);}

//SECRET TROPHIES!!!
var Trophy = function(){};
Trophy.POWERS = 0;
Trophy.HAT = 1;
Trophy.DEATH = 2;
Trophy.SECRET = 3;
Trophy.GiveTrophy = async function(trophy){
    var username = await Utils.gup("gjapi_username");
  if (username == null || username === '') return;
    var user_token = await Utils.gup("gjapi_token");
    // console.log(username + ", ");// + user_token);
    
    //This stuff is contextual to my game jolt game, so 
    //if you're making a game in game jolt, the achievement token
    //for your game should be able to be used here
    var game_id = GJAPI.game_id;

    var url = "http://gamejolt.com/api/game/v1/trophies/add-achieved/?game_id="+game_id+"&username="+username+
                "&user_token="+user_token;
    switch (trophy){
        case Trophy.POWERS:
            url += "&trophy_id=9184";
            // console.log("9184");
            break;
        case Trophy.HAT:    
            url += "&trophy_id=9185";
            // console.log("9185");
            break;
        case Trophy.DEATH:
            url += "&trophy_id=9187";
            // console.log("9187");
            break;
        case Trophy.SECRET:
            url += "&trophy_id=9186";
            // console.log("9186");
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

Trophy.AddScore = async function(score, sort, table_id){
    var username = await Utils.gup("gjapi_username");
  if (username == null || username === '') return;
    var user_token = await Utils.gup("gjapi_token");
    // console.log(username + ", " + user_token);
    
    //This stuff is contextual to my game jolt game, so 
    //if you're making a game in game jolt, the achievement token
    //for your game should be able to be used here
    var game_id = GJAPI.game_id;
    
    var url = "http://gamejolt.com/api/game/v1/scores/add/?game_id="+game_id+"&username="+username+"&user_token="+user_token+"&score="+score+"&sort="+sort+"&table_id="+table_id;
    
    var signature = url + GJAPI.private_token;
    signature = md5(signature);
    
    var xmlhttp = new XMLHttpRequest();
    var url = url + "&signature=" + signature;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}