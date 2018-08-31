// initialize
var modal;
var span;
document.addEventListener("DOMContentLoaded", function() {
  // Get the modal
  modal = document.getElementById("myModal");

  // hide modal by default
  modal.style.display = "none";

  // Get the <span> element that closes the modal
  span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // enable all options for debug
  document.getElementById("debug").addEventListener("change", function() {
    var dbgList = document.getElementsByClassName("debug");
    [].forEach.call(dbgList, function(item, index) {
      item.disabled = !document.getElementById("debug").checked;
    });
  });
});

// position of the image
var count1 = { value: 0 };
var count2 = { value: 0 };
var count3 = { value: 0 };

// variable that contains the speed of the spin
var vel1 = { value: 0 };
var vel2 = { value: 0 };
var vel3 = { value: 0 };

// variables to evaluate the lines
var topLine = [];
var middleLine = [];
var bottomLine = [];
var rules = [];

// initialize balance
var balance = 10;

// dict with amounts for every rule
var rulesAmount = {
  rule1: 2000,
  rule2: 1000,
  rule3: 4000,
  rule4: 150,
  rule5: 75,
  rule6: 50,
  rule7: 20,
  rule8: 10,
  rule9: 50
};

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
  topLine = [];
  middleLine = [];
  bottomLine = [];
  rules = [];
  incr = 1;
  inc(vel1);
  inc(vel2);
  inc(vel3);
  balance = parseInt(document.getElementById("balance").value)
  if (balance <= 0) {
    modal.style.display = "block";
    return;
  }
  clearInterface();
  balance -= 1;
  document.getElementById("balance").value = balance;
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
  // determine the initial value for finalPos
  var finalPos = pos - relativePos + 60;

  // if the debug mode is on determmine in which position and slot the user wanted to test
  if (document.getElementById("debug").checked) {
    var rdbg = (pdbg = "");
    switch (el) {
      case "reel1":
        rdbg = "reel_dbg1";
        pdbg = "pos_dbg1";
        break;
      case "reel2":
        rdbg = "reel_dbg2";
        pdbg = "pos_dbg2";
        break;
      case "reel3":
        rdbg = "reel_dbg3";
        pdbg = "pos_dbg3";
    }

    // recalculate the final pos based on the user especifications
    finalPos = parseInt(
      getKeyByValue(slotsPositions, document.getElementById(rdbg).value)
    );

    // determine the position in where the seleted element should be
    switch (document.getElementById(pdbg).value) {
      case "top":
        finalPos -= 120;
        break;
      case "bottom":
        finalPos += 120;
        break;
      default:
        finalPos;
    }
  }

  // interval of time until the slot is centered
  var interval2 = setInterval(function() {
    inc(count, vel.value);
    document.getElementById(el).style["background-position"] =
      "0% " + count.value + "px";
    if (count.value >= finalPos) {
      clearInterval(interval2);
      document.getElementById(el).style["background-position"] =
        "0% " + finalPos + "px";

      // getting the exact position where the slot stops
      var middlePosition = finalPos - 600 * parseInt(finalPos / 600);
      middlePosition = middlePosition < 0 ? 480 : middlePosition;
      var topPosition = middlePosition + 120;
      var bottomPosition = middlePosition == 0 ? 480 : middlePosition - 120;
      bottomPosition = bottomPosition < 0 ? 360 : bottomPosition;
      topLine.push(slotsPositions[topPosition]);
      middleLine.push(slotsPositions[middlePosition]);
      bottomLine.push(slotsPositions[bottomPosition]);
      if (el === "reel3") {
        // evaluate every line to check the win combination
        evaluateLine(topLine, "top");
        evaluateLine(middleLine, "middle");
        evaluateLine(bottomLine, "bottom");

        // enable start button only if the last reel has stopped
        document.getElementById("start").disabled = false;
        document.getElementById("debug").disabled = false;
      }
    }
  }, 1);
}

function evaluateLine(line, linePositon) {
  // function to evaluate if the line is winner
  evaluateRules(line, linePositon);
  [].forEach.call(rules, function(item, index) {
    balance += rulesAmount[item];
    document.getElementById(item).style.backgroundColor = "red";
  });
  document.getElementById("balance").value = balance;
  if (rules.length > 0) {
    blink("balance");
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
    }, 500);
  }, 1000);
  setTimeout(function() {
    clearInterval(interval);
  }, 4200);
}

function evaluateRules(line, pos) {
  var bars = ["bar", "2bar", "3bar"];
  var chse = ["cherries", "seven"];
  pos == "top" &&
  line[0] == "cherries" &&
  line[1] == "cherries" &&
  line[2] == "cherries"
    ? rules.push("rule1")
    : null; // rule1
  pos == "middle" &&
  line[0] == "cherries" &&
  line[1] == "cherries" &&
  line[2] == "cherries"
    ? rules.push("rule2")
    : null; // rule2
  pos == "bottom" &&
  line[0] == "cherries" &&
  line[1] == "cherries" &&
  line[2] == "cherries"
    ? rules.push("rule3")
    : null; // rule3
  line[0] == "seven" && line[1] == "seven" && line[2] == "seven"
    ? rules.push("rule4")
    : null; // rule4
  chse.indexOf(line[0]) >= 0 &&
  chse.indexOf(line[1]) >= 0 &&
  chse.indexOf(line[2]) >= 0
    ? rules.push("rule5")
    : null; // rule5
  line[0] == "3bar" && line[1] == "3bar" && line[2] == "3bar"
    ? rules.push("rule6")
    : null; // rule6
  line[0] == "2bar" && line[1] == "2bar" && line[2] == "2bar"
    ? rules.push("rule7")
    : null; // rule7
  line[0] == "bar" && line[1] == "bar" && line[2] == "bar"
    ? rules.push("rule8")
    : null; // rule8
  bars.indexOf(line[0]) >= 0 &&
  bars.indexOf(line[1]) >= 0 &&
  bars.indexOf(line[2]) >= 0
    ? rules.push("rule9")
    : null; // rule9
  return rules;
}

function clearInterface() {
  document.getElementById("start").disabled = true;
  document.getElementById("debug").disabled = true;
  var payTable = document.getElementsByClassName("rule");
  [].forEach.call(payTable, function(row, index) {
    row.style.backgroundColor = "";
    });
}
