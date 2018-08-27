// position of the image
var count = 0;

// variable that contains the speed of the spin
var vel = 0;

// variable that increment or decrement the speed of the spin
var incr = 0;

// variables to control the intervals of time
var intervals = [];
var interval2;

// variable to control when the sping is trying to stop
var stopping = false;

// create an array with the positions of the slots and the content
// the positions start from bottom to top, because the movement of the slot is toward down
var slotsPositions = {
  0: "3bar",
  484: "bar",
  363: "2bar",
  242: "seven",
  121: "cherries"
};

function start() {
  // initialize values
  incr = vel = 1;
  document.getElementById("start").disabled = true;
  var reels = document.getElementsByClassName("slot");
  var j = 1;
  var i;
  [].forEach.call(reels, function(el) {
    // interval of time in which the movement is executed
    i = setInterval(spinIt, 100, el.id);
    setTimeout(setDelay, 3000 * j, el.id, i);
    j += 1;
  });
}

function spinIt(el) {
  // moving the sprite a little down
  document.getElementById(el).style["background-position"] =
    "0% " + count + "px";

  // if increase is negative, means the spin is stopping
  // also limit the speed of the spin to 100
  if (vel < 100 || incr < 0) {
    // increse the speed of the spin
    vel += incr;
  }

  count += vel;
}

function setDelay(el, interval) {
  clearInterval(interval);
  finishMovement(el);
}

function stop() {
  incr -= 3;
}

// funciton to finilize the movement and center the slot
function finishMovement(el) {
  // getting the exact position of the slot
  pos = document.getElementById(el).style.backgroundPosition;
  pos = parseInt(pos.split(" ")[1]);

  // getting the final position where its stop
  // so image is vertically centered
  var relativePos = pos % 60;
  var finalPos = pos - relativePos + 60;

  // interval of time until the slot is centered
  interval2 = setInterval(function() {
    count += vel;
    document.getElementById(el).style["background-position"] =
      "0% " + count + "px";
    if (count >= finalPos) {
      clearInterval(interval2);
      document.getElementById(el).style["background-position"] =
        "0% " + finalPos + "px";
      document.getElementById("start").disabled = false;

      // getting the exact position where the slot stops
      posicion = finalPos - 605 * parseInt(finalPos / 605);
      document.getElementById("res_" + el).innerHTML = slotsPositions[posicion];
    }
  }, 1);
}
