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
  },
  // Array of character sprites
  'sprites': [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
  ],
  // The state of the game. 1 is character selecting and 0 is playing
  'state': 1, // Start the game on the character selector
  'startLives': 5, // Number of lives to start with
  'currentScore': 0
};

data.numLives = data.startLives; // Current number. Lives should be set globally so there are no conflicts

// Generic entity object for inheriting. Does not contain any actual functionality

var Entity = function () {
  // Blank
};

// Simple, generalized render function

Entity.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// A generic collision checking function with a target input

Entity.prototype.checkCollision = function (target) {
  // Simple box collision checking
  return this.x + this.collisionBox[0] < target.x + target.collisionBox[2] && this.x + this.collisionBox[2] > target.x + target.collisionBox[0] && this.y + this.collisionBox[1] < target.y + target.collisionBox[3] && this.y + this.collisionBox[3] > target.y + target.collisionBox[1];
};

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

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.constructor = Enemy;

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

// x and y start and end for collision box

Enemy.prototype.collisionBox = [1, 77, 112, 142];

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
  this.sprite = 'images/char-boy.png';
  // Whether the handleInput method should accept input
  this.acceptInput = true;
  this.lives = data.numLives;
  this.reset();
};

Player.prototype = Object.create(Entity.prototype);

Player.prototype.constructor = Player;

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
    this.checkCollision(allEnemies[i]) && (data.numLives > 0 && data.numLives--, this.reset());
  }

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

// Player controller object. Handles lives and score

var playerController = {};

playerController.heartIcon = 'images/Lives.png';

playerController.render = function () {
  if (data.state === 0) {
    for (var i = 0; i < data.numLives; i++) {
      ctx.drawImage(Resources.get(this.heartIcon), i*30 + 10, 60);
    }
  } else if (data.state === 2) {
    ctx.font = "60px Impact, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", data.canvas.width / 2, 250);
    ctx.font = "24px Impact, sans-serif";
    ctx.fillText("Press Enter to Restart", data.canvas.width / 2, 380);
  }
};

playerController.update = function () {
  data.numLives === 0 && data.state === 0 && this.gameOver();
};

playerController.gameOver = function () {
  // Set state to 2 (game over state)
  data.state = 2;
  // Engine.reset();
};

playerController.handleInput = function (keyCode) {
  keyCode === 13 && Engine.reset();
};

// Character selector PLAIN OBJECT (not a function), with update and render functions

var characterSelector = {};

Resources.load("images/Selector.png");
// Render the characters to be selected
characterSelector.render = function () {
  //Render the text first
  ctx.font = "24px Impact, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Use left and right arrows to select character", data.canvas.width / 2, 265);
  ctx.fillText("Press Enter to Start", data.canvas.width / 2, 300);
  // Render each character
  ctx.drawImage(Resources.get("images/Selector.png"), this.selected * 101, 300);
  for (var i = 0; i < data.sprites.length; i++) {
    ctx.drawImage(Resources.get(data.sprites[i]), i * 101, 300);
  }
};

characterSelector.handleInput = function (keyCode) {
  keyCode === 37 && this.selected > 0 && this.selected--;
  keyCode === 39 && this.selected < this.numCharacters - 1 && this.selected++;
  if (keyCode === 13) {
    // Start game
    player.sprite = data.sprites[this.selected];
    data.state = 0;
  }
}

characterSelector.selected = 0;

// Number of characters
characterSelector.numCharacters = data.sprites.length;

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
  // Send event to player only if the game is being played
  if (data.state === 0) {
        var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
  } else if (data.state === 1) {
    // Simply send the keycode
    characterSelector.handleInput(e.keyCode);
  } else if (data.state === 2) {
    playerController.handleInput(e.keyCode);
  }

});
