// A variable for referencing the width and height of the tiles
var tile = {
  "width": 101,
  "height": 83
};

// Enemies our player must avoid

var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Use the wrap function to position the enemy
    this.wrap();



}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // If x is higher than canvas width, wrap
    if (this.x > canvas.width) {
      this.wrap();
    }
}

// Change enemy row number and speed when created, or after wrapping past the screen's edge

Enemy.prototype.wrap = function() {
  // Set the row number to a random row. Add another tile.height and subtract 16 so the enemies are centered on the blocks, starting from the second row.
  this.y = Math.floor(Math.random() * 3) * tile.height + tile.height - 16;
  // Set a random speed from 300 to 600;
  this.speed = 300 + Math.random() * 300;
  // Reset the x
  // Set the x position to the -200 (beyond the edge of the screen)
  this.x = -200;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// x and y start and end for collision box

Enemy.prototype.collisionBox = [1, 77, 112, 142];

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
  this.sprite = 'images/char-boy.png';
  this.reset();
};

//A function for resetting the player to the default state
Player.prototype.reset = function () {
  // Set x to 2 tiles to the right.
  this.x = tile.width * 2;
  // Set x to 4 tiles down. Subtract 32 so figure is in correct position
  this.y = tile.height * 5 - 32;
};

Player.prototype.update = function () {
  //If at row 1 (x value -32), reset
  this.y <= -32 && this.reset();
  //Check collision
  for (var i = 0; i < allEnemies.length; i++) {
    // Get a reference to the enemy currently being processed for convenience
    var currentEnemy = allEnemies[i];
    this.x + this.collisionBox[0] < currentEnemy.x + currentEnemy.collisionBox[2] &&
    this.x + this.collisionBox[2] > currentEnemy.x + currentEnemy.collisionBox[0] &&
    this.y + this.collisionBox[1] < currentEnemy.y + currentEnemy.collisionBox[3] &&
    this.y + this.collisionBox[3] > currentEnemy.y + currentEnemy.collisionBox[1] &&
    this.reset();
  }

};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.collisionBox = [17, 86, 83, 150]; // This is not the exact bounds of the character. Instead, this bounding box is used to constrain collisions to the "current" row.

Player.prototype.handleInput = function (keyValue) {

  // Hard coded values for preventing the player from going off the screen
  //Up down left right movement
  switch (keyValue) {
    case 'left':
    if (this.x <= 20) {
      return;
    }
    this.x -= tile.width;
    break;
    case 'right':
    if (this.x >= 400) {
      return;
    }
    this.x += tile.width;
    break;
    case 'up':
    if (this.y <= 20) {
      return;
    }
    this.y -= tile.height;
    break;
    case 'down':
    if (this.y >= 360) {
      return;
    }
    this.y += tile.height;
    break;
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];

var player = new Player();

// Push 3 enemies to the array

for (var i = 0; i < 3; i++) {
  allEnemies.push(new Enemy());
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
