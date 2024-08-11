/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: sprig run
@author: 
@tags: []
@addedOn: 2024-00-00
*/

//Sprite mapping
const player = "p"
const stock_wall = "w"
const spike = "s"
const grey = "g"
const dark_grey = "d"
const black = "b"

//Constant game values - modify for a different game experience
const airtimeMax = 250
const baselineY = 2
const sinkrate = 200 // How fast the player sinks in milliseconds
const jumpdelay = 250 //The time between moving up 1 y during a jump and the next step up
const floorY = 33
const tickrate = 10

//Functions
function sinkplayer() {
  setInterval(() => {
    if (playerSprite.y < floorY) { // Check if player isn't on the floor
      playerSprite.y += 1; // Incrementally bring them down
    }
  }, sinkrate); // (keep in mind) sinkrate is a global variable
}

function gameoverCheck() {
  setInterval(() => {
    if (isPlayerTouchingDeadlyObj()) { // Check if player is on a spike
      pushdebug("Game over")
    }
  }, 10); 
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function pushdebug(message) {
  addText("debug output:\n" + message, { x:5, y:5, color: color`3`});
}

function isPlayerOnSomething() {
    const playerTileBelow = getTile(playerSprite.x, playerSprite.y + 1);
    return playerTileBelow.some(sprite => sprite.type === box || sprite.type === stock_wall);
}

function isPlayerTouchingDeadlyObj() {
  pushdebug("func ran")
  const playerTileBelow = getTile(playerSprite.x, playerSprite.y + 1);
  return playerTileBelow.some(sprite => sprite.type === spike)
}

function jumpSlowly() {
  playerSprite.y -= 1
  sleep(100)
  playerSprite.y -= 1
}

setLegend(
  [ player, bitmap`
0000000000000000
0..............0
0..............0
0..............0
0...3.......3..0
0..............0
0..............0
0..............0
0.33.........330
0..33........3.0
0...333....333.0
0.....333333...0
0..............0
0..............0
0..............0
0000000000000000` ],
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
0000000000000000`]
)

setSolids([player, stock_wall, spike])

let level = 0
let airtime = 0
let lastinput
const levels = [
  map`
w....p.....w
w..........w
w..........w
w..s.......w
w..........w
w..........w
w.......s..w
w..........w
w..........w
w..........w
w..........w
w..........w
w...s......w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w
w..........w`,
]

setMap(levels[level])

const playerSprite = getFirst(player)

setPushables({
  [ player ]: []
})

onInput("s", () => {
  playerSprite.y += 1
})
onInput("w", () => {
  onSmth = isPlayerOnSomething()
  if (onSmth) {
    pushdebug("on smth? "+ onSmth)
    jumpSlowly()
    //playerSprite.y -= 1
  }
  else {
    pushdebug("on smth?" + onSmth)
  }
})
onInput("a", () => {
  playerSprite.x -= 1
})
onInput("d", () => {
  playerSprite.x += 1
})

sinkplayer(); // Call sinkplayer function continuously
gameoverCheck();

afterInput(() => {

});
