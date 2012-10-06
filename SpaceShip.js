var SI = {};
/*
 * Constructs a new SpaceShip
 * Parameters
 * x - spaceship position on x-axis
 * y - spaceship position on y-axis
 * rad - spaceship radious
 */
SI.SpaceShip = function (x, y, rad) {
	this.x = x;
	this.y = y;
	this.rad = rad;
}
/*
 * Moves spaceship by delta from it's current position
 * Parameters
 * deltaX - amount to move on x-axis
 * deltaY - amount to move on y-axis
 */
SI.SpaceShip.prototype.move = function (deltaX, deltaY) {
	this.x += deltaX;
	if(this.x <= this.rad) {
		this.x = this.rad;
	}
	else if(this.x >= SI.Sizes.width - this.rad) {
		this.x = SI.Sizes.width - this.rad;
	}
	
	this.y += deltaY;
	if(this.y <= this.rad) {
		this.y = this.rad;
	}
	else if(this.y >= SI.Sizes.height - this.rad) {
		this.x = SI.Sizes.height - this.rad;
	}
}
/*
 * Draws the spaceship
 * Parameters
 * painter - canvas context(painter)
 */
SI.SpaceShip.prototype.draw = function (painter) {
	painter.beginPath();
	painter.arc(this.x, this.y, this.rad, 0, Math.PI*2, true);
	painter.fill();
}
/*
 * Constructs a new rocket 
 * Parameters
 * x - rocket position on x-axis
 * y - rocket position on y-axis
 */
SI.Rocket = function (x, y, direction) {
	this.x = x;
	this.y = y;
	this.direction = direction;
	// current status of rocket
	// used for deletion of rocket
	this.exploded = false;
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
	if(this.y <= 0) {
		this.exploded = true;
	}
}
SI.Rocket.prototype.draw = function (painter) {
	painter.fillStyle = "white";
	painter.strokeStyle = "red";
	painter.beginPath();
	painter.moveTo(this.x, this.y);
	painter.lineTo(this.x, this.y + this.direction * SI.Sizes.rocketHeight);
	painter.stroke();
}
