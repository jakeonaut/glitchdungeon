function KeyManager(){
	this.keys_pressed = {};
	this.keys_down = {};
	this.keys_up = {};
}

//KEY STATIC NAMES
KeyManager.LEFT = 37;
KeyManager.UP = 38;
KeyManager.RIGHT = 39;
KeyManager.DOWN = 40;
KeyManager.ENTER = 13;
KeyManager.SPACE = 32;


KeyManager.prototype.KeyDown = function(e){
	this.keys_down[e.keyCode] = true;
	this.keys_pressed[e.keyCode] = true;
	this.PreventArrowDefaults(e); 
}

KeyManager.prototype.KeyUp = function(e){
	delete this.keys_down[e.keyCode];
	this.PreventArrowDefaults(e);
}

KeyManager.prototype.ForgetKeysPressed = function(){
	this.keys_pressed = {};
}

KeyManager.prototype.PreventArrowDefaults = function(e){
	switch(e.keyCode){
    case KeyManager.LEFT: 
	case KeyManager.UP: 
	case KeyManager.RIGHT:  
	case KeyManager.DOWN:
    case KeyManager.SPACE: 
		e.preventDefault(); 
		break;
    default: break; // do not block other keys
  }
}