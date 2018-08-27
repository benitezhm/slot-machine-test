// position of the image
var count = 0;

// variable that contains the speed of the spin
var vel = 0;

// variable that increment or decrement the speed of the spin
var incr = 0;

// variables to control the intervals of time
var intervals = [];
var interval2;

// create an array with the positions of the slots and the content
// the positions start from bottom to top, because the movement of the slot is toward down
var slotsPositions = {
  50: "3bar",
  550: "bar",
  425: "2bar",
  300: "seven",
  175: "cherries"
};

function start() {
  // initialize values
  incr = vel = 1;
  document.getElementById("start").disabled = true;
  var reels = document.getElementsByClassName("slot");
  var j = 0;
  [].forEach.call(reels, function(el) {
    // interval of time in which the movement is executed
    setInterval(spinIt, 50, el.id);
    j += 1;
  });
}

function spinIt(el) {
  // moving the sprite a little down
  document.getElementById(el).style["background-position"] = "0% " + count + "px";

  // if increase is negative, means the spin is stopping
  // also limit the speed of the spin to 100
  if (vel < 100 || incr < 0) {
    // increse the speed of the spin
    vel += incr;
  }
  // enable stop button
  if (vel > 50) {
    document.getElementById("stop").disabled = false;
  }

  // if the speed is less than or equal to 0 we stop the spin
  if (vel <= 3 && incr < 0) {
    document.getElementById("stop").disabled = true;
    clearInterval(interval1);
    var reels = document.getElementsByClassName("slot");
    [].forEach.call(reels, function(el) {
      finishMovement(el);
    });
  }
  count += vel;
}

function stop() {
  incr -= 3;
}

// Función para finalizar el movimiento en un elemento centrado
function finishMovement(el) {
  // obtenemos la posicion exacta de la imagen
  pos = el.style.backgroundPosition;
  pos = parseInt(pos.split(" ")[1]);

  // obtenemos la posicion final donde parar para que quede la imagen
  // bien encuadrada
  var relativePos = pos % 125;
  var finalPos = pos - relativePos + 125;

  // intervalo de tiempo hasta que se centra la imagen en el recuadro
  interval2 = setInterval(function() {
    count += vel;
    el.style["background-position"] = "0% " + count + "px";
    if (count >= finalPos) {
      clearInterval(interval2);
      el.style["background-position"] = "0% " + finalPos + "px";
      document.getElementById("start").disabled = false;

      // obtenemos la posicion exacta de donde se ha parado dentro de la imagen
      posicion = finalPos - 605 * parseInt(finalPos / 605);
      document.getElementById("result").innerHTML = slotsPositions[posicion];
    }
  }, 1);
}
// })();
