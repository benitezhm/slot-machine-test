// position of the image
var count1 = { value: 0 };
var count2 = { value: 0 };
var count3 = { value: 0 };

// variable that contains the speed of the spin
var vel1 = { value: 0 };
var vel2 = { value: 0 };
var vel3 = { value: 0 };

// helper function to increase the value of wrapper var
function inc(x, i = 1) {
  x.value += i;
}

// variable that increment or decrement the speed of the spin
var incr = 0;

// variables to control the intervals of time
var intervals = [];

// variable to control when the sping is trying to stop
var stopping = false;

// create an array with the positions of the slots and the content
// the positions start from bottom to top, because the movement of the slot is toward down
var slotsPositions = {
  120: "3bar",
  600: "bar",
  0: "bar",
  480: "2bar",
  360: "seven",
  240: "cherries"
};

function start() {
  // initialize values
  incr = 1;
  inc(vel1);
  inc(vel2);
  inc(vel3);
  document.getElementById("start").disabled = true;
  var reels = document.getElementsByClassName("slot");
  var interval;
  var delayTime = 2000;
  [].forEach.call(reels, function(el, index) {
    // interval of time in which the movement is executed
    switch (index) {
      case 0:
        interval = setInterval(spinIt, 100, el.id, count1, vel1);
        setTimeout(setDelay, delayTime, el.id, interval, count1, vel1);
        break;
      case 1:
        interval = setInterval(spinIt, 100, el.id, count2, vel2);
        setTimeout(setDelay, delayTime, el.id, interval, count2, vel2);
        break;
      case 2:
        interval = setInterval(spinIt, 100, el.id, count3, vel3);
        setTimeout(setDelay, delayTime, el.id, interval, count3, vel3);
    }
    delayTime += 500;
  });
}

function spinIt(el, count, vel) {
  // moving the sprite a little down
  document.getElementById(el).style["background-position"] =
    "0% " + count.value + "px";

  // if increase is negative, means the spin is stopping
  // also limit the speed of the spin to 100
  if (vel.value < 100 || incr < 0) {
    // increse the speed of the spin
    inc(vel, incr);
  }

  inc(count, vel.value);
}

function setDelay(el, interval, count, vel) {
  clearInterval(interval);
  finishMovement(el, count, vel);
}

function stop() {
  incr -= 3;
}

// funciton to finilize the movement and center the slot
function finishMovement(el, count, vel) {
  // getting the exact position of the slot
  pos = document.getElementById(el).style.backgroundPosition;
  pos = parseInt(pos.split(" ")[1]);

  // getting the final position where its stop
  var relativePos = pos % 60;
  // validate here if the debug mode is on before determine the finalPos
  var finalPos = pos - relativePos + 60;
  finalPos = getKeyByValue(slotsPositions, document.getElementById("reel1_sel").value);

  // interval of time until the slot is centered
  var interval2 = setInterval(function() {
    inc(count, vel.value);
    document.getElementById(el).style["background-position"] =
      "0% " + count.value + "px";
    if (count.value >= finalPos) {
      clearInterval(interval2);
      document.getElementById(el).style["background-position"] =
        "0% " + finalPos + "px";
      // enable start button only if the last reel has stopped
      if (el === "reel3") {
        document.getElementById("start").disabled = false;
      }

      // getting the exact position where the slot stops
      var middlePosition = finalPos - 600 * parseInt(finalPos / 600);
      var topPosition = middlePosition + 120;
      var bottomPosition = middlePosition == 0 ? 480 : middlePosition - 120;
      var topLine = [];
      var middleLine = [];
      var bottomLine = [];
      topLine.push(slotsPositions[topPosition]);
      middleLine.push(slotsPositions[middlePosition]);
      bottomLine.push(slotsPositions[bottomPosition]);
      var balance = 0;
      if (topLine.length === 3) {
        balance = evaluateLine(topLine, "top");
      }
      var res =
        slotsPositions[topPosition] +
        " " +
        slotsPositions[middlePosition] +
        " " +
        slotsPositions[bottomPosition];
      document.getElementById("res_" + el).innerHTML = res;
    }
  }, 1);
}

function evaluateLine(line, linePositon) {
  // function to evaluate if the line is winner
  if (
    linePositon === "top" &&
    line[0] == "cherry" &&
    line[1] == "cherry" &&
    line[2] == "cherry"
  ) {
    document.getElementsByClassName("balance").innerHTML = balance + "$";
    blink("cherry_top");
  }
}

// utility function to get the key for the corresponding value
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

// function to make text blinking
function blink(el) {
  var interval = setInterval(function() {
    document.getElementById(el).style.webkitTransitionDuration = "0.7s";
    document.getElementById(el).style.opacity = 0;
    setTimeout(function() {
      document.getElementById(el).style.webkitTransitionDuration = "0.7s";
      document.getElementById(el).style.opacity = 1;
    }, 700);
  }, 1400);
  setTimeout(function() {
    clearInterval(interval);
  }, 5600);
}
