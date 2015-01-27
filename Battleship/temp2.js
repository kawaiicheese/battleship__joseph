function Ship(shipLength) {
    
    this.shipLength = shipLength;
    this.locations = [0, 0, 0];
    this.hits = ["", "", ""];
        
};

function Game() {
    this.boardSize = 8;
    this.numShips = 4;
    this.shipsSunk = 0;
    
    this.ships = [];  
};

Game.prototype.isSunk = function(ship) {
        for (var i = 0; i < ship.shipLength; i++)  {
                if (ship.hits[i] !== "hit") {
                        return false;
                }
        }
    return true;
};

Game.prototype.generateShip = function(ship) {
       // Choose whether the ship is vertical or horizontal
       // Also an exampl of using Math.random
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) { // horizontal
                row = Math.floor(Math.random() * this.boardSize);
                col = Math.floor(Math.random() * (this.boardSize - ship.shipLength + 1));
        } else { // vertical
                row = Math.floor(Math.random() * (this.boardSize - ship.shipLength + 1));
                col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < ship.shipLength; i++) {
                if (direction === 1) {
                        newShipLocations.push(row + "" + (col + i));
                } else {
                        newShipLocations.push((row + i) + "" + col);
                }
        }
        return newShipLocations;
};

Game.prototype.fire = function(guess) {
        for (var i = 0; i < this.numShips; i++) {
                var ship = this.ships[i];
                var index = ship.locations.indexOf(guess);

                if (ship.hits[index] === "hit") {
                Game.view.displayMessage("Oops, you already hit that location!");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                Game.view.displayHit(guess);
                Game.view.displayMessage("HIT!");

                if (this.isSunk(ship)) {
                        Game.view.displayMessage("You sank my battleship!");
                        this.shipsSunk++;
                }
                return true;
            }
        }
        Game.view.displayMiss(guess);
        Game.view.displayMessage("You missed.");
        return false;
};

Game.prototype.generateShipLocations = function() {
        // Create ships here.
        var location;
        for (var i = 0; i < this.numShips; i++) {
                do {
                        location = this.generateShip(this.ships[i]);
                } while (this.collision(location));
                this.ships[i].locations = location;
        }
        console.log("Ships array: ");
        console.log(this.ships);
};

Game.prototype.collision = function(locations) {
        for (var i = 0; i < this.numShips; i++) {
                var ship = this.ships[i];
                for (var j = 0; j < locations.length; j++) {
                        if (ship.locations.indexOf(locations[j]) >= 0) {
                                return true;
                        }
                }
        }
        return false;
};

Game.prototype.view = {
    
    displayMessage: function(msg)  {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
    
};


Game.prototype.parseGuess = function(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H"];

    if (guess === null || guess.length !== 2) {
            alert("Oops, please enter a letter and a number on the board.");
    } else {
            var firstChar = guess.charAt(0);
            var row = alphabet.indexOf(firstChar);
            var column = guess.charAt(1);
 
            if (isNaN(row) || isNaN(column)) {
                    alert("Oops, that isn't on the board.");
            } else if (row < 0 || row >= this.boardSize ||
                       column < 0 || column >= this.boardSize) {
                    alert("Oops, that's off the board!");
                    console.log("Calvin's ship:  " + this.ships[0]);
            } else {
                    return row + column;
            }
    }
    return null;
};

Game.prototype.controller = {
	guesses : 0,

	processGuess: function(guess) {
		var location = this.parseGuess(guess);
		if (location) {
			guesses++;
			var hit = this.fire(location);
			if (hit && this.shipsSunk === this.numShips) {
				Game.view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
			}
		}
	}
};
// event handlers

Game.prototype.handleFireButton = function() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();

        Game.controller.processGuess(guess);

	guessInput.value = "";
};

Game.prototype.handleKeyPress = function(e) {
	var fireButton = document.getElementById("fireButton");

	// in IE9 and earlier, the event object doesn't get passed
	// to the event handler correctly, so we use window.event instead.
	e = e || window.event;

	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
};




// init - called when the page has completed loading

window.onload = init;

function init() {
        var game = new Game();

        for (var i = 0; i < game.numShips; i++) {
            var temp = new Ship(3);
            game.ships.push(temp);
        }
	// Fire! button onclick handler
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = game.handleFireButton();

	// handle "return" key press
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = game.handleKeyPress();

	// place the ships on the game board
	game.generateShipLocations();
}