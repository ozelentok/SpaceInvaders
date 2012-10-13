//===================Spaceship ==============================
/*
 * Constructs a new SpaceShip
 * x - spaceship position on x-axis
 * y - spaceship position on y-axis
 * width - spaceship width
 * height - spaceship height
 * img - spaceship drawing
 */

SI.SpaceShip = function (options) {
	var defaultOptions = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		img: null,
		imgX: 0, 
	}
	for (var key in defaultOptions) {
		if(options.hasOwnProperty(key)) {
			this[key] = options[key];
		}
		else {
			this[key] = defaultOptions[key];
		}
	}
}

/*
 * Moves spaceship by delta from it's current position
 * Parameters
 * deltaX - amount to move on x-axis
 * deltaY - amount to move on y-axis
 */
SI.SpaceShip.prototype.move = function (deltaX, deltaY) {
	this.x += deltaX;
	if(this.x <= 0) {
		this.x = 0;
	}
	else if(this.x >= SI.Sizes.width - this.width) {
		this.x = SI.Sizes.width - this.width;
	}
	
	this.y += deltaY;
	if(this.y <= 0) {
		this.y = 0;
	}
	else if(this.y >= SI.Sizes.height - this.height) {
		this.x = SI.Sizes.height - this.height;
	}
}
// Moves spaceship by to a new location
SI.SpaceShip.prototype.setLocation = function (newX) {
	this.x = newX;
	if(this.x <= 0) {
		this.x = 0;
	}
	else if(this.x >= SI.Sizes.width - this.width) {
		this.x = SI.Sizes.width - this.width;
	}


}
/*
 * Draws the spaceship
 * Parameters
 * painter - canvas context(painter)
 */
SI.SpaceShip.prototype.draw = function (painter) {
	painter.drawImage(this.img, this.imgX, 0, this.img.width, this.img.height,
			this.x, this.y, this.width, this.height);
	
}
//===================Rockets ==============================
/*
 * Constructs a new rocket 
 * x - rocket position on x-axis
 * y - rocket position on y-axis
 * direction - rocket going up or down
 */
SI.Rocket = function (options) {

	var defaultOptions = {
		x: 0,
		y: 0,
		direction: null,
		img: SI.Images.rocketImg,
		exploded: false
	}
	for (var key in defaultOptions) {
		if(options.hasOwnProperty(key)) {
			this[key] = options[key];
		}
		else {
			this[key] = defaultOptions[key];
		}
	}
}
/*
 * Moves rocket by delta from it's current position
 * The rocket moves on y-axis only
 * if the rocket hits the top, it explodes
 * Parameters
 * deltaY - amount to move on y-axis
 */
SI.Rocket.prototype.move = function (deltaY) {
	this.y += this.direction * deltaY;
	if(this.y <= 0 || this.y + SI.Sizes.rocketHeight >= SI.Sizes.bottomMargin) {
		this.exploded = true;
	}
}
SI.Rocket.prototype.draw = function (painter) {
	painter.drawImage(this.img, this.x, this.y, SI.Sizes.rocketWidth, SI.Sizes.rocketHeight); 
}
//===================Explosions ==============================
/*
 * Constructs a new Explosion 
 * x - explosion position on x-axis
 * y - explosion position on y-axis
 * img - image to use for explosion
 */
SI.Explosion = function (options) {
	var defaultOptions = {
		x: 0,
		y: 0,
		img: SI.Images.explosionImg,
		imgX: 0,
		expanding: true,
		done: false
	}
	for (var key in defaultOptions) {
		if(options.hasOwnProperty(key)) {
			this[key] = options[key];
		}
		else {
			this[key] = defaultOptions[key];
		}
	}
}

SI.Explosion.prototype.draw = function (painter) {
	painter.drawImage(this.img, this.imgX, 0, this.img.width, this.img.height,
			this.x, this.y, SI.Sizes.explosionWidth, SI.Sizes.explosionHeight);
}
