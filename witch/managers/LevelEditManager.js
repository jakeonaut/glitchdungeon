function InitLevelEdit(){
	$("level_edit_buttons").style.display="block";
}

function DrawLevelEditGrid(ctx, map){
	var color = "#000000";
	
	for (var i = 1; i < map.MAP_WIDTH; i++){
		drawLine(ctx, color, i * Tile.WIDTH, 0, i * Tile.WIDTH, map.MAP_HEIGHT * Tile.HEIGHT);
	}
	
	for (var i = 1; i < map.MAP_HEIGHT; i++){
		drawLine(ctx, color, 0, i * Tile.HEIGHT, map.MAP_WIDTH * Tile.WIDTH, i * Tile.HEIGHT);
	}
}

function LevelEditMouseDown(e){
	var box = canvas.getBoundingClientRect();
	var x = Math.floor((e.clientX - box.left) / VIEW_SCALE / Tile.WIDTH);
	var y = Math.floor((e.clientY - box.top) / VIEW_SCALE / Tile.HEIGHT);

	var tile = map_manager.tiles[y][x];
	switch (tile.collision){
		case Tile.SOLID:
			tile.collision = Tile.FALLTHROUGH;
			break;
		case Tile.FALLTHROUGH:
			tile.collision = Tile.GHOST;
			break;
		default:
			tile.collision = Tile.SOLID;
			break;
	}
}