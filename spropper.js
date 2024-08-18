/*

@title: spropper
@author: bea
@tags: []
@addedOn: 2024-00-00
*/

var gameover = false
var lastplayerx = 0
var time = 0 //Seconds

//Sprite mapping
const player = "p"
const stock_wall = "w"
const spike = "s"
const grey = "g"
const dark_grey = "d"
const black = "b"
const platform = "l"
const background = "z"
const yestrigger = "y"
const notrigger = "n"
const leftchain = "c"
const leftendplatform = "e"
const rightendplatform = "j"
const rightchain = "f"

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
      level = 0;
      setMap(levels[level]);
    }
    if (gameover) {
      clearText()
      gameoverSequence();
    } else {
    }
  }, 200);
}

function gameoverSequence() {
  addText("Game Over!", { x: 5, y: 0, color: color`3` });
  addText("Play again?", { x: 5, y: 1, color: color`0` });

  addText("Yes", { x: 6, y: 9, color: color`4` })
  addText("No", { x: 12, y: 9, color: color`3` })

  if (isPlayerTouchingYesOrNo() == 1) {
    gameover = false
    level = 1
    setMap(levels[level]);
    clearText()
  }
}

function nextlevelCheck() {
  setInterval(() => {
    if (isPlayerTouchingLevelTransition()) {
      lastplayerx = getFirst(player).x;
      level++;
      setMap(levels[level]); 
      getFirst(player).x = lastplayerx;
    }
  }, tickrate);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pushdebug(message) {
  //No console ;(
  clearText()
  addText("debug output:\n" + message, { x: 5, y: 5, color: color`3` });
}

function isPlayerOnSomething() {
  //Dictates whether the player can jump
  const playerTileBelow = getTile(getFirst(player).x, getFirst(player).y + 1);
  return playerTileBelow.some(sprite => sprite.type === platform || leftendplatform || rightendplatform);
}

function isPlayerTouchingDeadlyObj() {
  //Dictates whether the player has lost or not
  const playerTileBelow = getTile(getFirst(player).x, getFirst(player).y + 1);
  return playerTileBelow.some(sprite => sprite.type === spike)
}

function isPlayerTouchingLevelTransition() {
  //Transitions the level because I couldn't figure out how to get a smooth scrolling fov...
  const playerTileBelow = getTile(getFirst(player).x, getFirst(player).y + 1);
  return playerTileBelow.some(sprite => sprite.type === black)
}

function isPlayerTouchingYesOrNo() {
  //Dictates whether the game continues or not
  const playerTileBelow = getTile(getFirst(player).x, getFirst(player).y + 1);
  if (playerTileBelow.some(sprite => sprite.type === yestrigger)) {
    return 1 //Signals yes
  } else if ((playerTileBelow.some(sprite => sprite.type === notrigger))) {
    return 2 //Signals no
  } else {
    return 0
  }
}

function jumpSlowly() {
  //I don't even think this works like I mean it to
  for (let i = 0; i < 3; i++) {
    getFirst(player).y -= 1
    sleep(100)
  }
}

function updateCounters() {
  addText("Time=0", {x:13,y:1,color:color`2`});
  setInterval(() => {
    if(!gameover) {
      time++
      addText("Time="+time, {x:13,y:1,color:color`2`});
    }
  }, 1000);
  setInterval(() => {
    if(!gameover) {
      addText("Level="+level, {x:1,y:1,color:color`2`});
    }
  }, tickrate)
}
  
setLegend(
  [player, bitmap`
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
00LLLLLLLLLLLL00`],
  [stock_wall, bitmap`
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
  [spike, bitmap`
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
  [grey, bitmap`
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
  [dark_grey, bitmap`
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
  [black, bitmap`
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
  [platform, bitmap`
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
  [leftendplatform, bitmap`
LLLLLLLLLLLLLLLL
CCCCLCCCCCCLCCCC
CCC1L1CCCC1L1CCC
CC11L11CC11L11CC
LLLLLLLLLLLLLLLL
.........L00000L
........L0LLLLLL
.......L0L......
......L0L.......
.....L0L........
....L0L.........
...L0L..........
..L0L...........
.L0L............
L0L.............
0L..............`],
  [rightendplatform, bitmap`
LLLLLLLLLLLLLLLL
CCCCLCCCCCCLCCCC
CCC1L1CCCC1L1CCC
CC11L11CC11L11CC
LLLLLLLLLLLLLLLL
L00000L.........
LLLLLL0L........
......L0L.......
.......L0L......
........L0L.....
.........L0L....
..........L0L...
...........L0L..
............L0L.
.............L0L
..............L0`],
  [yestrigger, bitmap`
....4...4....4..
....44...44..44.
4....4....44..44
4....44....4...4
.4....4.....4...
.4....44....44..
.44....44....44.
..44....444...44
...4......44....
...44......44...
....444.....444.
......44......44
.......44.......
........44......
.........444....
...........44...`],
  [notrigger, bitmap`
..33....3...33..
...33...33...33.
....3....3....33
....33...33....3
.....33...33...3
......33...333..
3......33....33.
33......33....33
.33......33....3
..33......33....
....33.....333..
.....33......333
......33.......3
........33......
.........33.....
..........33....`],
  [leftchain, bitmap`
..............L0
.............L0L
............L0L.
...........L0L..
..........L0L...
.........L0L....
........L0L.....
.......L0L......
......L0L.......
.....L0L........
....L0L.........
...L0L..........
..L0L...........
.L0L............
L0L.............
0L..............`],
  [rightchain, bitmap`
0L..............
L0L.............
.L0L............
..L0L...........
...L0L..........
....L0L.........
.....L0L........
......L0L.......
.......L0L......
........L0L.....
.........L0L....
..........L0L...
...........L0L..
............L0L.
.............L0L
..............L0`],
  [background, bitmap`
11LL11111L11111L
1LL11111LL1111LL
LL1111LL11111LL1
L1111LL1111LL111
1111LL1111LL1111
11LLL1111LL1111L
1LL11111LL1111LL
LL11111LL1111LL1
L11111LL1111LL11
11111LL11111L111
1111LL11111LL111
111LL11111LL1111
1LL111111LL11111
LL111111LL111111
1111111LL1111111
111111LL11111111`]
)

setSolids([player, stock_wall, spike, platform, leftendplatform, rightendplatform, leftchain, rightchain])

setBackground("z")

let level = 1 //Level 0 is the game over stage

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
wyyyyywnnnnnw
wyyyyywnnnnnw
wyyyyywnnnnnw
wyyyyywnnnnnw
wyyyyywnnnnnw
wyyyyywnnnnnw
wyyyyywnnnnnw
wyyyyywnnnnnw`,
  map`
w....p.....w
w..........w
w..........w
w..s.......w
w..........w
w..........w
wle..s..s..w
wc.........w
w..........w
w.....s....w
w..........w
ws.......jlw
w...s.....fw
w..........w
w..........w
w......s...w
w..........w
wggggggggggw
wddddddddddw
wbbbbbbbbbbw`,
  map`
w....p.....w
w..........w
w.......sssw
w..........w
w..........w
w..........w
wlle.......w
w.c.ssss...w
wc.........w
w.....ss...w
w..........w
w..........w
w..........w
w..........w
w...ssssjllw
w........f.w
w.........fw
wggggggggggw
wddddddddddw
wbbbbbbbbbbw`,
  map`
w.....p....w
wle........w
wc.........w
w..........w
w..........w
w..ssssss..w
w..........w
w..........w
w.s......ssw
w....s.s...w
w...s.s....w
ws.........w
w..........w
w..........w
wsss....jllw
w...ss...f.w
w....ss...fw
wggggggggggw
wddddddddddw
wbbbbbbbbbbw`,
  map`
w....p.....w
w..........w
w..........w
wsss.ll.sssw
wc........fw
w..........w
w...s..s...w
w..s....s..w
w.s......s.w
w..........w
w.........jw
wssss..ssssw
wc........fw
w.ss.....s.w
w..........w
w...s......w
w..........w
w..s..s.s..w
w..........w
w..........w`
]

setMap(levels[level]) //Mabye maintain level int to be constantly referenced

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
  setMap(levels[level]); //Debugging
})

//All of these functions run off setInterval to form their own local little loops
sinkplayer();
gameoverCheck();
nextlevelCheck();
updateCounters();

afterInput(() => {

});
