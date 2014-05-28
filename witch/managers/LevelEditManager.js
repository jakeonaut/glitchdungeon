World.PLAYER = 0;
World.TILE_SOLID = 1;
World.TILE_FALLTHROUGH = 2;
World.TILE_GHOST = 3;
function World(){}

var level_edit_mouse_down = false;
var level_edit_object;
var level_edit_object_is_tile = false;

function InitLevelEdit(){
	$("level_edit_objects").style.display="block";
	$("level_edit_buttons").style.display="block";
	
	function keypress(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13) { //Enter keycode                        
			e.preventDefault();
			ledit_change_room_size();
		}
	}
	$("room_width").onkeypress = keypress;
	$("room_height").onkeypress = keypress;
	level_edit = true;
	
	ledit_select($("tile_solid"), World.TILE_SOLID);
}

function DisableLevelEdit(){
	$("level_edit_objects").style.display="none";
	$("level_edit_buttons").style.display="none";
	level_edit = false;
}

function DrawLevelEditGrid(ctx, room){
	var color = "#000000";
	
	var ax = (-room.camera.x) % Tile.WIDTH;
	var ay = (-room.camera.y) % Tile.HEIGHT;
	for (var i = 1; i < ~~(GAME_WIDTH/Tile.WIDTH)+1; i++){
		drawLine(ctx, color, ax+ i * Tile.WIDTH, 0, ax + i * Tile.WIDTH, room.SCREEN_HEIGHT, 0.5);
	}
	
	for (var i = 1; i < ~~(GAME_HEIGHT/Tile.HEIGHT)+1; i++){
		drawLine(ctx, color, 0, ay + i * Tile.HEIGHT, room.SCREEN_WIDTH, ay + i * Tile.HEIGHT, 0.5);
	}
}

function LevelEditMouseDown(e){
	if (!level_edit) return;
	e.preventDefault();
	level_edit_mouse_down = true;
	var box = canvas.getBoundingClientRect();
	
	var x = (e.clientX - box.left) / VIEW_SCALE + room.camera.x;
	var y = (e.clientY - box.top) / VIEW_SCALE + room.camera.y;
	var tile_x = Math.floor(x / Tile.WIDTH);
	var tile_y = Math.floor(y / Tile.HEIGHT);
	
	if (level_edit_object_is_tile){
		var tile = room.tiles[tile_y][tile_x];
		switch (level_edit_object){
			case Tile.SOLID:
				tile.collision = Tile.SOLID;
				break;
			case Tile.FALLTHROUGH:
				tile.collision = Tile.FALLTHROUGH;
				break;
			default:
				tile.collision = Tile.GHOST;
				break;
		}
	}
	else{
		if (level_edit_object == World.PLAYER){
			room.player.x = x - (room.player.rb/2);
			room.player.y = y - room.player.bb;
		}
		else{
			if (e.which === 3 && e.button === 2){ //RIGHT CLICK. REMOVE OBJ IF UNDER
				for (var i = room.entities.length-1; i >= 0; i--){
					if (room.entities[i].IsPointColliding(x, y)){
						room.entities.splice(i, 1);
					}
				}
			}else{
				x = tile_x * Tile.WIDTH;
				y = tile_y * Tile.HEIGHT
				var obj = eval(level_edit_object);
				obj.x = x;
				obj.y = y;
				room.entities.push(obj);
			}
		}
	}
}

function LevelEditMouseMove(e){
	if (!level_edit) return;
	if (level_edit_mouse_down && level_edit_object_is_tile){
		LevelEditMouseDown(e);
	}
}

function LevelEditMouseUp(e){
	if (!level_edit) return;
	level_edit_mouse_down = false;
}

function ledit_change_room_size(){
	room.ChangeSize($("room_width").value, $("room_height").value);
}

function ledit_export(){
	$("level_edit_export_text").value = JSON.stringify(room.Export());
}

function ledit_import(){
	var obj_str = $("level_edit_export_text").value;
	try{
		if (obj_str !== null && obj_str !== ""){
			room.Import(JSON.parse(obj_str));
		}
	}catch(e){
		console.log(e);
	}
}

function ledit_reset(){
	room = new Room();
	$("room_width").value = room.SCREEN_WIDTH;
	$("room_height").value = room.SCREEN_HEIGHT;
}

function ledit_select(box, obj_type){
	var selected = getElementsByClass("selected_object_box");
	if (selected.length > 0){
		selected[0].className = "object_box";
	}

	box.className = "selected_object_box";
	
	level_edit_object_is_tile = false;
	switch (obj_type){
		case World.PLAYER:
			level_edit_object = World.PLAYER;
			break;
		case World.TILE_SOLID:
			level_edit_object_is_tile = true;
			level_edit_object = Tile.SOLID;
			break;
		case World.TILE_FALLTHROUGH:
			level_edit_object_is_tile = true;
			level_edit_object = Tile.FALLTHROUGH;
			break;
		case World.TILE_GHOST:
			level_edit_object_is_tile = true;
			level_edit_object = Tile.GHOST;
			break;
		default:
			level_edit_object = obj_type;
	}
}