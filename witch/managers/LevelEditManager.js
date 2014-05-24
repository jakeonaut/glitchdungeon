World.PLAYER = 0;
World.TILE_SOLID = 1;
World.TILE_FALLTHROUGH = 2;
function World(){}

var level_edit_object;
var level_edit_object_is_tile = false;

function InitLevelEdit(){
	$("level_edit_objects").style.display="block";
	$("level_edit_buttons").style.display="block";
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
	
	for (var i = 1; i < room.MAP_WIDTH; i++){
		drawLine(ctx, color, i * Tile.WIDTH, 0, i * Tile.WIDTH, room.MAP_HEIGHT * Tile.HEIGHT, 0.5);
	}
	
	for (var i = 1; i < room.MAP_HEIGHT; i++){
		drawLine(ctx, color, 0, i * Tile.HEIGHT, room.MAP_WIDTH * Tile.WIDTH, i * Tile.HEIGHT, 0.5);
	}
}

function LevelEditMouseDown(e){
	var box = canvas.getBoundingClientRect();
	
	var x = (e.clientX - box.left) / VIEW_SCALE;
	var y = (e.clientY - box.top) / VIEW_SCALE;
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
	}else{
		if (level_edit_object == World.PLAYER){
			room.player.x = x - (room.player.rb/2);
			room.player.y = y - room.player.bb;
		}
		else{
		}
	}
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
		default:
			level_edit_object_is_tile = true;
			level_edit_object = Tile.GHOST;
			break;
	}
}