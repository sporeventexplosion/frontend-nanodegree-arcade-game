// A data object holding the global game configuration

var data = {
  // Canvas size
  'canvas': {
    'width': 505,
    'height': 606
  },
  // The size for each
  'tile': {
    'width': 101,
    'height': 83
  }
};

// Generic entity object for inheriting. Does not contain any actual functionality

var Entity = function () {
  // Blank
};

// Simple, generalized render function

Entity.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Enemies our player must avoid

var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    // Random starting x
    this.x = Math.random() * data.canvas.width;
    this.setRandomAttr();
    // Whether the enemy should move reversed. Randomly chosen.
    this.reversed = Math.random() >= 0.5;
    this.sprite = this.reversed ? 'images/enemy-bug-reversed.png' : 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // Subtract if reversed, add otherwise
    this.reversed ? this.x -= this.speed * dt : this.x += this.speed * dt;

    // If x is higher than canvas width and backward is false, wrap
    this.reversed ? this.x < -101 && this.wrap() : this.x > data.canvas.width && this.wrap();
}

// Change enemy row number and speed when created, or after wrapping past the screen's edge

Enemy.prototype.wrap = function() {
  // Randomize row number and speed
  this.setRandomAttr();
  // Reset the x
  // Set the x position to the -101 (exactly the width of 1 bug)
  this.x = this.reversed ? data.canvas.width : -101;
}

// Function for randomizing enemy attributes, for at initialization and when wrapping
Enemy.prototype.setRandomAttr = function() {
  // Set the row number to a random row. Add another tile.height and subtract 16 so the enemies are centered on the blocks, starting from the second row.
  this.y = Math.floor(Math.random() * 3) * data.tile.height + data.tile.height - 16;
  // Set a random speed from 300 to 600;
  this.speed = 300 + Math.random() * 300;
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
  // Whether the handleInput method should accept input
  this.acceptInput = true;
  this.reset();
};

//A function for resetting the player to the default state
Player.prototype.reset = function () {
  // Set acceptInput to true
  this.acceptInput = true;
  // Set x to 2 tiles to the right.
  this.x = data.tile.width * 2;
  // Set x to 4 tiles down. Subtract 32 so figure is in correct position
  this.y = data.tile.height * 5 - 32;
};

Player.prototype.update = function () {
  //If at row 1 (x value -32), reset. The acceptInput is so the restart function does not fire continuously during the time waited in the restart function.
  this.y <= -32 && this.acceptInput && this.restart();
  //Check collision
  for (var i = 0; i < allEnemies.length; i++) {
    // Get a reference to the enemy currently being processed for convenience
    var currentEnemy = allEnemies[i];
    if (this.x + this.collisionBox[0] < currentEnemy.x + currentEnemy.collisionBox[2] && this.x + this.collisionBox[2] > currentEnemy.x + currentEnemy.collisionBox[0] && this.y + this.collisionBox[1] < currentEnemy.y + currentEnemy.collisionBox[3] && this.y + this.collisionBox[3] > currentEnemy.y + currentEnemy.collisionBox[1]) {
      this.reset();
    }
  }

};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// a function that disables input, pauses and resets

Player.prototype.restart = function () {
  // Freeze the player for 800ms and then restart
  this.acceptInput = false;
  // Set a reference to this so reset can be called from within settimeout
  var currentPlayer = this;
  setTimeout(function(){
    currentPlayer.reset();
  }, 800);

};

Player.prototype.collisionBox = [17, 86, 83, 150]; // This is not the exact bounds of the character. Instead, this collision box is used to constrain collisions to the "current" row.

Player.prototype.handleInput = function (keyValue) {

  // Do not continue if acceptInput is false. (an if statement needs to be used as you cannot return from boolean operators)

  if (this.acceptInput === false) {
    return;
  }

  // Hard coded values for preventing the player from going off the screen
  //Up down left right movement
  switch (keyValue) {
    case 'left':
    if (this.x <= 20) {
      return;
    }
    this.x -= data.tile.width;
    break;
    case 'right':
    if (this.x >= 400) {
      return;
    }
    this.x += data.tile.width;
    break;
    case 'up':
    if (this.y <= 20) {
      return;
    }
    this.y -= data.tile.height;
    break;
    case 'down':
    if (this.y >= 360) {
      return;
    }
    this.y += data.tile.height;
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
