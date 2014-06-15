function Animation(max_frame, frame_delay, frame_width, frame_height, rel_ani_x, rel_ani_y){
	this.max_frame = max_frame;
	this.frame_count = 0;
	this.frame_delay = frame_delay;
	this.frame_width = defaultValue(frame_width, 16);
	this.frame_height = defaultValue(frame_height, 16);
	this.rel_ani_x = defaultValue(rel_ani_x, 0);
	this.rel_ani_y = defaultValue(rel_ani_y, 0);
	this.abs_ani_x = 0;
	this.abs_ani_y = 0;
	this.x_offset = 0;
	this.y_offset = 0;
	this.animation_end = false;
	this.frame_change = false;
	this.repeat = true;
	
	this.Restart();
}

Animation.prototype.Restart = function(){
	this.curr_frame = 0;
	this.frame_count = 0;
	this.animation_end = false;
	this.frame_change = false;
}

Animation.prototype.Change = function(rax, ray, mf){
	if (!(this.rel_ani_x == rax && this.rel_ani_y == ray && this.max_frame == mf)){
		this.rel_ani_x = rax;
		this.rel_ani_y = ray;
		this.max_frame = mf;
		this.Restart();
	}
}

Animation.prototype.Update = function(gameTime){
	//TODO:: This should do something with gameTime???
	this.frame_change = false;
	this.animation_end = false;
	
	this.frame_count++;
	if (this.frame_count >= this.frame_delay){
		if (this.curr_frame < this.max_frame) this.curr_frame++;
		if (this.curr_frame >= this.max_frame)
		{
			if (this.repeat)
				this.curr_frame = 0;
			else this.curr_frame = this.max_frame - 1;
			this.animation_end = true;
		}
		this.frame_count = 0;
		this.frame_change = true;
	}
}