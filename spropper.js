/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: sprig run
@author: 
@tags: []
@addedOn: 2024-00-00
*/

var gameover = false
var lastplayerx = 0

//Sprite mapping
const player = "p"
const stock_wall = "w"
const spike = "s"
const grey = "g"
const dark_grey = "d"
const black = "b"
const platform = "l"
const background = "z"

//Constant game values - modify for a different game experience
const airtimeMax = 250
const baselineY = 2
const sinkrate = 300 // How fast the player sinks in milliseconds
const jumpdelay = 250 // The time between moving up 1 y during a jump and the next step up
const floorY = 33
const tickrate = 10 // How often checks for things like collision are done (ms)

//Functions
function sinkplayer() {
  setInterval(() => {
    if (getFirst(player).y < floorY) { // Check if player isn't on the floor
      getFirst(player).y += 1; // Incrementally bring them down
    }
  }, sinkrate); // (keep in mind) sinkrate is a global variable
}

function gameoverCheck() {
  setInterval(() => {
    if (isPlayerTouchingDeadlyObj()) { // Check if player is on a spike
      gameover = true;
      level -= 1;
      setMap(levels[level]);
    }

    if (gameover) {
      gameoverSequence();
    }
    else {
      clearText()
    }
  }, 200);
}

function gameoverSequence() {
  addText("Game Over!", { x: 5, y: 0, color: color`3` });
  addText("Play again?", { x: 5, y: 1, color: color`0` });

  addText("Yes", { x:6, y:9, color: color`4`})
  addText("No", { x:12, y:9, color: color`3`})
}
function nextlevelCheck() {
  setInterval(() => {
    if (isPlayerTouchingLevelTransition()) {
      lastplayerx = getFirst(player).x;
      level++; // Increment the level to load the next level
      setMap(levels[level]); // Correct function call syntax to switch to the next level
    }
  }, tickrate);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function pushdebug(message) {
  clearText()
  addText("debug output:\n" + message, { x:5, y:5, color: color`3`});
}

function isPlayerOnSomething() {
    const playerTileBelow = getTile(getFirst(player).x, getFirst(player).y + 1);
    return playerTileBelow.some(sprite => sprite.type === platform);
}

function isPlayerTouchingDeadlyObj() {
  const playerTileBelow = getTile(getFirst(player).x, getFirst(player).y + 1);
  return playerTileBelow.some(sprite => sprite.type === spike)
}

function isPlayerTouchingLevelTransition() {
  const playerTileBelow = getTile(getFirst(player).x, getFirst(player).y + 1);
  return playerTileBelow.some(sprite => sprite.type === black)
}

function jumpSlowly() {
  getFirst(player).y -= 1
  sleep(100)
  getFirst(player).y -= 1
}

setLegend(
  [ player, bitmap`
00LLLLLLLCCCCC00
02222CCCCCCCCCC0
L2CCCCCCCCCCCC2L
L2CCCCCCC222222L
L22222222222222L
L22222222222222L
L22222222222222L
L22202222220222L
L22222222222222L
L22222222222222L
L22222222222222L
L22220222202222L
L22222000022222L
L22222222222222L
0222222222222220
00LLLLLLLLLLLL00` ],
  [ stock_wall, bitmap`
LLLLLLLLLLLLLLLL
111L1111111L1111
111L1111111L1111
111L1111111L1111
LLLLLLLLLLLLLLLL
111111L1111111L1
111111L1111111L1
111111L1111111L1
LLLLLLLLLLLLLLLL
11L11111111L1111
11L11111111L1111
11L11111111L1111
LLLLLLLLLLLLLLLL
11111L1111111L11
11111L1111111L11
11111L1111111L11`],
  [ spike, bitmap`
.......33.......
......3..3......
.....3....3.....
.....3....3.....
....3......3....
....3......3....
...3........3...
...3........3...
...3........3...
..3..........3..
..3..........3..
.3............3.
.3............3.
.3............3.
3..............3
3..............3`],
  [ grey, bitmap`
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111`],
  [ dark_grey, bitmap`
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL`],
  [ black, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`],
  [ platform, bitmap`
LLLLLLLLLLLLLLLL
CCCCLCCCCCCLCCCC
CCC1L1CCCC1L1CCC
CC11L11CC11L11CC
LLLLLLLLLLLLLLLL
................
................
................
................
................
................
................
................
................
................
................`],
  [ background, bitmap`
LLLLLLLLLLLLLL1L
LLLLLLLLLLLLL11L
1111111LLLL11L1L
LLLLLL11L111LLLL
LLLLLLL111LLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
1LLLLLLLLLLLLLLL
11111LLLLLLLLLL1
LLLL11111111L11L
LLLLLLLLLLL111LL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL`]
)

setSolids([player, stock_wall, spike, platform])
setBackground("z")

let level = 1

const levels = [
  map`
w...........w
w...........w
w.....p.....w
wl..llwll..lw
w.....w.....w
w.....w.....w
w.....w.....w
w.....w.....w
w.....w.....w
w.....w.....w
w.....w.....w
w.....w.....w
w.....w.....w
w.....w.....w
w.....w.....w
w.....w.....w
w.....w.....w
w.....w.....w
w.....w.....w
w.....w.....w`,
  map`
w....p.....w
w..........w
w..........w
w..s.......w
w..........w
w..........w
wll.....s..w
w..........w
w..........w
w..........w
w..........w
w........llw
w...s......w
w..........w
w..........w
w..........w
w..........w
wggggggggggw
wddddddddddw
wbbbbbbbbbbw`,
  map`
w..........w
w..........w
w..........w
w..........w
w.p........w
w..........w
wlll.......w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w.......lllw
w..........w
w..........w
wggggggggggw
wddddddddddw
wbbbbbbbbbbw`,
  map`
w.....p....w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w`
]

setMap(levels[level])

onInput("w", () => {
  if (isPlayerOnSomething()) {
    jumpSlowly()
  }
})

onInput("a", () => {
  getFirst(player).x -= 1
})

onInput("s", () => {
  getFirst(player).y += 1
})

onInput("d", () => {
  getFirst(player).x += 1
})

onInput("i", () => {
  level++
  setMap(levels[level]); // Correct function call syntax to switch to the next level
})

sinkplayer(); // Call sinkplayer function continuously
gameoverCheck();
nextlevelCheck();

afterInput(() => {

});
