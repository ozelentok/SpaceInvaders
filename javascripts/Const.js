var SI = {};
/*
 * Sizes for drawing and computing
 */
SI.Sizes = {
	width: $(window).width(),
	height: $(window).height(),

	lineWidth: 1,
	maxRockets: 8,

	pointModifer: 5,
	//miliseconds per frame
	MSPF: 1000 / 30,

	turnUntilFire: 25,
	waitSprite: 5, 
}
	SI.Sizes.modifier = 1;
	if(SI.Sizes.width <= 360 || SI.Sizes.height <= 640) {
		SI.Sizes.modifier = 0.7;
	}

	SI.Sizes.enemyInRow = Math.floor(SI.Sizes.height / SI.Sizes.modifier / 100);
	SI.Sizes.enemyInColumn = Math.floor(SI.Sizes.width / SI.Sizes.modifier / 80);

	SI.Sizes.playerShipWidth = 40 * SI.Sizes.modifier;
	SI.Sizes.playerShipHeight = 20 * SI.Sizes.modifier;
	SI.Sizes.playerStep = 20 * SI.Sizes.modifier;


	SI.Sizes.enemyWidth = 40 * SI.Sizes.modifier;
	SI.Sizes.enemyHeight = 30 * SI.Sizes.modifier;
	SI.Sizes.enemyStepHort = 3 * SI.Sizes.modifier;
	SI.Sizes.enemyStepVert = 10 * SI.Sizes.modifier;
	SI.Sizes.enemySpacing = 15 * SI.Sizes.modifier;

	SI.Sizes.rocketHeight = 20 * SI.Sizes.modifier;
	SI.Sizes.rocketWidth = 6 * SI.Sizes.modifier;
	SI.Sizes.rocketStep = 20 * SI.Sizes.modifier;

	SI.Sizes.explosionWidth = 40 * SI.Sizes.modifier;
	SI.Sizes.explosionHeight = 40 * SI.Sizes.modifier;

	SI.Sizes.font = 25 * SI.Sizes.modifier + 'px Arial';
	SI.Sizes.messageFont =  0.125 * SI.Sizes.modifier * SI.Sizes.width + 'px Arial';
	SI.Sizes.topMargin = 0;
	SI.Sizes.leftMargin =  10 * SI.Sizes.modifier;
	SI.Sizes.bottomMargin = SI.Sizes.height - 60 * SI.Sizes.modifier;
	SI.Sizes.rightMargin = SI.Sizes.width - 10 * SI.Sizes.modifier;

	SI.Sizes.textMargin = SI.Sizes.bottomMargin + 45 * SI.Sizes.modifier;
	SI.Sizes.textRightMargin = SI.Sizes.width - 140 * SI.Sizes.modifier;

	SI.Sizes.popUpX = 50 * SI.Sizes.modifier;
	SI.Sizes.popUpY = 100 * SI.Sizes.modifier;
	SI.Sizes.popUpWidth = SI.Sizes.width - 100 * SI.Sizes.modifier;
	SI.Sizes.popUpHeight = SI.Sizes.height - 400 * SI.Sizes.modifier;

SI.Images = {};


SI.Images.playerImg = new Image();
SI.Images.playerImg.src = 'images/player.png';
SI.Images.playerImg.phases = 1 - 1;
SI.Images.playerImg.width = 40;
SI.Images.playerImg.height = 20;

SI.Images.enemyImg = new Image();
SI.Images.enemyImg.src = 'images/enemy.png';
SI.Images.enemyImg.phases = 2 - 1;
SI.Images.enemyImg.width = 40;
SI.Images.enemyImg.height = 30;

SI.Images.rocketImg = new Image();
SI.Images.rocketImg.src = 'images/rocket.png';

SI.Images.explosionImg = new Image();
SI.Images.explosionImg.src = 'images/explosion.png';
SI.Images.explosionImg.phases = 7 - 1;
SI.Images.explosionImg.width = 40;
SI.Images.explosionImg.height = 40;

/*
 * Colors for fillStyle and strokeStyle
 */
SI.Colors = {
	rocket: '#07f',
	ground: 'green',
	text: 'white',
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

