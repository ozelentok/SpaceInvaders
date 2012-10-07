var SI = {};
/*
 * Constructs a new Game
 */
SI.Game = function() {
	// canvas context
	this.xpainter;
	// current pressed key
	this.currentKey;
	// rockets on the game grid
	this.rockets;
	// player ship
	this.playerShip;
	// enemy ships
	this.enemyShips;
	// clearance to fire again
	this.okToFire;
}
/*
 * Sizes for drawing and computing
 */
SI.Sizes = {
	height:	900,
	width:	800,

	playerShipWidth: 50,
	playerShipHeight: 20,
	playerStep: 20,

	enemyInRow: 6,
	enemyInColumn: 10,
	enemyWidth: 40,
	enemyHeight: 30,
	enemyStep: 5,
	enemySpacing: 15,

	rocketHeight: 15,
	rocketWidth: 5,
	rocketStep: 20,

	lineWidth: 1,
	maxRockets: 8,
	//miliseconds per frame
	MSPF: 1000 / 24 
}
	SI.Sizes.topMargin = 100,
	SI.Sizes.leftMargin =  30,
	SI.Sizes.bottomMargin =  SI.Sizes.height - 100,
	SI.Sizes.rightMargin = SI.Sizes.width - 30,

/*
 * Colors for fillStyle and strokeStyle
 */
SI.Colors = {
	player: "green",
	enemy: "#f30",
	rocket: "#07f",
	background: "black"
}
/*
 * Directions for rockets and spaceships
 */
SI.Directions = {
	Down: 1,
	Up: -1,
	
	Right: 1,
	Left: -1
}

/*
 * Events key codes
 */
SI.Keys = {
	Left: 37,
	Right: 39,
	Up: 38
}

