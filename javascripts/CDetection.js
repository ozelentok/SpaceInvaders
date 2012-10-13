SI.CDetection = function () {
}

/*
 * Detects collision between rockets and enemy ships
 * Paramters
 * rockets
 * ships
 * Returns a lists of {row:ship row, col:ship col} in order to delete them;
 */
SI.CDetection.prototype.detectHitEnemies = function (rockets, ships) {
	var toDelete = [];
	for (var i = 0; i < rockets.length; i += 1) {
		var found = false;
		var rowFoundIn = -1;
		var colFoundIn = -1;
		for (var row = 0; row < ships.length && !found; row += 1) {
			if(ships[row][0]) {
				found = this.isRocketInRow(rockets[i], ships[row][0]);
				if (found) {
					rowFoundIn = row;
				}
			}
		}
		if (found) {
			found = false;
			for (var col = 0; col < ships[rowFoundIn].length && !found; col += 1) {
				found = this.isRocketInColumn(rockets[i], ships[rowFoundIn][col])
				if (found) {
					colFoundIn = col;
				}
			}
			if (found) {
				toDelete.push({row: rowFoundIn, col: colFoundIn});
				rockets[i].exploded = true;
			}
		}
	}
	return toDelete;
}
SI.CDetection.prototype.detectHitPlayer = function(rockets, player) {
	for (var i = 0; i < rockets.length; i += 1) {
		if(this.isRocketInRow(rockets[i], player) && this.isRocketInColumn(rockets[i], player)) {
			rockets[i].exploded = true;
			return true;
		}
	}
	return false;
}
SI.CDetection.prototype.isRocketInRow = function (rocket, ship) {
	var rocketTop = rocket.y + SI.Sizes.rocketHeight;
	var shipTop = ship.y + ship.height;
	if((rocketTop > shipTop) && (rocket.y < shipTop)) {
		return true;
	}
	if((rocket.y < ship.y) && (rocketTop > ship.y)) {
		return true;
	}
	if((rocketTop < shipTop) && (rocket.y > ship.y)) {
		return true;
	}
	return false;
}
SI.CDetection.prototype.isRocketInColumn = function (rocket, ship) {
	var rocketLeft = rocket.x - SI.Sizes.rocketWidth;;
	var shipRight = ship.x + ship.width;
	if((rocket.x > shipRight) && (rocketLeft < shipRight)) {
		return true;
	}
	if((rocketLeft < ship.x) && (rocket.x > ship.x)) {
		return true;
	}
	if((rocket.x < shipRight) && (rocketLeft > ship.x)) {
		return true;
	}
	return false;
}
