function defaultValue(variable, def_val){
	return typeof variable !== 'undefined' ? variable : def_val;
}

function isValidTile(i, j, map){
	return !(i < 0 || i >= map.MAP_HEIGHT || j < 0 || j >= map.MAP_WIDTH);
}