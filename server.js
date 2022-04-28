const fs = require(`fs`);
const http = require(`http`);
const WebSocket = require(`ws`); // npm i ws

const board = [
  [
    "card back",
    "card rank-2 spades",
    "card rank-3 spades",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-10 diams",
    "card rank-q diams",
    "card rank-k diams",
    "card rank-a diams",
    "card back",
  ],

  [
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-3 clubs",
    "card rank-2 clubs",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-6 spades",
    "card rank-7 spades",
    "card rank-a clubs",
  ],

  [
    "card rank-7 clubs",
    "card rank-a spades",
    "card rank-2 diams",
    "card rank-3 diams",
    "card rank-4 diams",
    "card rank-k clubs",
    "card rank-q clubs",
    "card rank-10 clubs",
    "card rank-8 spades",
    "card rank-k clubs",
  ],

  [
    "card rank-8 clubs",
    "card rank-k spades",
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-9 hearts",
    "card rank-8 hearts",
    "card rank-9 clubs",
    "card rank-9 spades",
    "card rank-6 spades",
  ],

  [
    "card rank-9 clubs",
    "card rank-q spades",
    "card rank-7 clubs",
    "card rank-6 hearts",
    "card rank-5 hearts",
    "card rank-2 hearts",
    "card rank-7 hearts",
    "card rank-8 clubs",
    "card rank-10 spades",
    "card rank-10 clubs",
  ],

  [
    "card rank-a spades",
    "card rank-7 hearts",
    "card rank-9 diams",
    "card rank-a hearts",
    "card rank-4 hearts",
    "card rank-3 hearts",
    "card rank-k hearts",
    "card rank-10 diams",
    "card rank-6 hearts",
    "card rank-2 diams",
  ],

  [
    "card rank-k spades",
    "card rank-8 hearts",
    "card rank-8 diams",
    "card rank-2 clubs",
    "card rank-3 clubs",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-q diams",
    "card rank-5 hearts",
    "card rank-3 diams",
  ],

  [
    "card rank-q spades",
    "card rank-9 hearts",
    "card rank-7 diams",
    "card rank-6 diams",
    "card rank-5 diams",
    "card rank-a clubs",
    "card rank-a diams",
    "card rank-k diams",
    "card rank-4 hearts",
    "card rank-4 diams",
  ],

  [
    "card rank-10 spades",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-k hearts",
    "card rank-a hearts",
    "card rank-3 spades",
    "card rank-2 spades",
    "card rank-2 hearts",
    "card rank-3 hearts",
    "card rank-5 diams",
  ],

  [
    "card back",
    "card rank-9 spades",
    "card rank-8 spades",
    "card rank-7 spades",
    "card rank-6 spades",
    "card rank-9 diams",
    "card rank-8 diams",
    "card rank-7 diams",
    "card rank-6 diams",
    "card back",
  ],
];

const positionBoard = [
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
];

const deck = [
  "card rank-a spades",
  "card rank-2 spades",
  "card rank-3 spades",
  "card rank-4 spades",
  "card rank-5 spades",
  "card rank-6 spades",
  "card rank-7 spades",
  "card rank-8 spades",
  "card rank-9 spades",
  "card rank-10 spades",
  "card rank-j spades",
  "card rank-q spades",
  "card rank-k spades",
  "card rank-a clubs",
  "card rank-2 clubs",
  "card rank-3 clubs",
  "card rank-4 clubs",
  "card rank-5 clubs",
  "card rank-6 clubs",
  "card rank-7 clubs",
  "card rank-8 clubs",
  "card rank-9 clubs",
  "card rank-10 clubs",
  "card rank-j clubs",
  "card rank-q clubs",
  "card rank-k clubs",
  "card rank-a diams",
  "card rank-2 diams",
  "card rank-3 diams",
  "card rank-4 diams",
  "card rank-5 diams",
  "card rank-6 diams",
  "card rank-7 diams",
  "card rank-8 diams",
  "card rank-9 diams",
  "card rank-10 diams",
  "card rank-j diams",
  "card rank-q diams",
  "card rank-k diams",
  "card rank-a hearts",
  "card rank-2 hearts",
  "card rank-3 hearts",
  "card rank-4 hearts",
  "card rank-5 hearts",
  "card rank-6 hearts",
  "card rank-7 hearts",
  "card rank-8 hearts",
  "card rank-9 hearts",
  "card rank-10 hearts",
  "card rank-j hearts",
  "card rank-q hearts",
  "card rank-k hearts",
];

const divideDeckIntoPieces = (deck) => {
  let shuffled = deck
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  const result = new Array(Math.ceil(shuffled.length / 6))
    .fill()
    .map((_) => shuffled.splice(0, 6));
  console.log(result);
  return result;
};

// code to read file
const readFile = (fileName) =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, `utf-8`, (readErr, fileContents) => {
      if (readErr) {
        reject(readErr);
      } else {
        resolve(fileContents);
      }
    });
  });

// code to create a server
const server = http.createServer(async (req, resp) => {
  console.log(`browser asked for ${req.url}`);
  if (req.url == `/mydoc`) {
    const clientHtml = await readFile(`client.html`);
    resp.end(clientHtml);
  } else if (req.url == `/myjs`) {
    const clientJs = await readFile(`client.js`);
    resp.end(clientJs);
  } else if (req.url == `/sequence.css`) {
    const sequenceCss = await readFile(`sequence.css`);
    resp.end(sequenceCss);
  } else {
    resp.end(`not found`);
  }
});

// to listen for clients
server.listen(8000);

// creating a web socket
const wss = new WebSocket.Server({ port: 8080 });

const acrossCondition = () => {
  let green = 0;
  let blue = 0;
  for (let i = 0; i < positionBoard.length; i++) {
    for (let j = 0; j < positionBoard[i].length; j++) {
      if (positionBoard[i][j] == "g") {
        blue = 0;
        green += 1;
        if (green == 5) {
          return [true, "g"];
        }
      } else if (positionBoard[i][j] == "b") {
        green = 0;
        blue += 1;
        if (blue == 5) {
          return [true, "b"];
        }
      } else {
        green = 0;
        blue = 0;
      }
    }
  }
  return [false, ""];
};
const downCondition = () => {
  let green = 0;
  let blue = 0;
  for (let i = 0; i < positionBoard.length; i++) {
    for (let j = 0; j < positionBoard[i].length; j++) {
      if (positionBoard[j][i] == "g") {
        blue = 0;
        green += 1;
        if (green == 5) {
          return [true, "g"];
        }
      } else if (positionBoard[j][i] == "b") {
        green = 0;
        blue += 1;
        if (blue == 5) {
          return [true, "b"];
        }
      } else {
        green = 0;
        blue = 0;
      }
    }
  }
  return [false, ""];
};

const upCondition = () => {
  let green = 0;
  let blue = 0;
  for (let i = positionBoard.length - 1; i >= 0; i--) {
    for (let j = positionBoard[i].length - 1; j >= 0; j--) {
      if (positionBoard[j][i] == "g") {
        blue = 0;
        green += 1;
        if (green == 5) {
          return [true, "g"];
        }
      } else if (positionBoard[j][i] == "b") {
        green = 0;
        blue += 1;
        if (blue == 5) {
          return [true, "b"];
        }
      } else {
        green = 0;
        blue = 0;
      }
    }
  }
  return [false, ""];
};

const diagonal = (start1, start2) => {
  let green = 0;
  let blue = 0;
  let j = start2;

  for (let i = start1; i < positionBoard.length; i++) {
    if (positionBoard[i][j] == "g") {
      blue = 0;
      green += 1;
      if (green == 5) {
        return [true, "g"];
      }
    } else if (positionBoard[i][j] == "b") {
      green = 0;
      blue += 1;
      if (blue == 5) {
        return [true, "b"];
      }
    } else {
      green = 0;
      blue = 0;
    }
    j++;
  }
  return [false, ""];
};
const dcheck = () => {
  for (let i = 0; i < positionBoard.length; i++) {
    for (let j = 0; j < positionBoard[i].length; j++) {
      if (i + 5 < positionBoard.length && positionBoard[i][j] != "-") {
        return diagonal(i, j);
      }
    }
  }
  return [false, ""];
};
const diagonalReverse = (start1, start2) => {
  let green = 0;
  let blue = 0;
  let j = start2;
  for (let i = start1; i < positionBoard.length; i++) {
    if (positionBoard[i][j] == "g") {
      blue = 0;
      green += 1;
      if (green == 2) {
        return [true, "g"];
      }
    } else if (positionBoard[i][j] == "b") {
      green = 0;
      blue += 1;
      if (blue == 5) {
        return [true, "b"];
      }
    } else {
      green = 0;
      blue = 0;
    }
    j--;
  }
  return [false, ""];
};
const dcheckReverse = () => {
  for (let i = 0; i < positionBoard.length; i++) {
    for (let j = positionBoard[i].length; j >= 0; j++) {
      if (i + 5 < positionBoard.length && positionBoard[i][j] != "-") {
        return diagonalReverse(i, j);
      }
    }
  }
  return [false, ""];
};

const check = () => {
  let across = acrossCondition();
  let up = upCondition();
  let down = downCondition();
  let dcheckk = dcheck();
  let dcheckReversee = dcheckReverse();

  if (across[0] == true) {
    return across[1];
  } else if (up[0] == true) {
    return up[1];
  } else if (down[0] == true) {
    return down[1];
  } else if (dcheckk[0] == true) {
    return dcheckk[1];
  } else if (dcheckReversee[0] == true) {
    return dcheckReversee[1];
  } else {
    return "None";
  }
};

let client_deck = null;
client_deck = divideDeckIntoPieces(deck);

let client_no = 0;
let colors = ["green", "blue", "green", "blue"];
let wsList = [];
let emptyDecks = [];
wss.on("connection", (ws) => {
  wsList.push(ws);
  client_no++;
  if (client_no == 4) {
    for (let i = 0; i < 4; i++) {
      wsList[i].send(
        JSON.stringify({
          type: "newboard",
          board: board,
          positionBoard: positionBoard,
          playerId: i,
          client: client_deck[i],
          color: colors[i],
          turn: 1,
        })
      );
    }
  }
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "cardclicked") {
      let row = data.row;
      let col = data.column;
      let color = data.color;
      let tt = data.turn;
      if (tt + 1 == 5) {
        tt = 0;
      }
      if (color == "green") {
        positionBoard[row][col] = "g";
      } else if (color == "blue") {
        positionBoard[row][col] = "b";
      }
      let win = check();
      for (let i = 0; i < 4; i++) {
        wsList[i].send(
          JSON.stringify({
            type: "positionUpdate",
            positionBoard: positionBoard,
            turn: tt + 1,
          })
        );
      }
      if (win == "g" || win == "b") {
        for (let i = 0; i < 4; i++) {
          wsList[i].send(
            JSON.stringify({
              type: "winner",
              winningTeam: win,
            })
          );
        }
      }
    } else if (data.type === "request new deck") {
      for (let i = 0; i < 4; i++) {
        if (ws == wsList[i]) {
          ws.send(
            JSON.stringify({
              type: "newDeck",
              deck: client_deck[4 + i],
            })
          );
          break;
        }
      }
    } else if (data.type === "Out of cards") {
      let id = data.player;
      if (!emptyDecks.includes(id)) {
        emptyDecks.push(id);
      }
      if (emptyDecks.length == 4) {
        for (let i = 0; i < 4; i++) {
          wsList[i].send(
            JSON.stringify({
              type: "tie",
            })
          );
        }
      }
    }
  };
});
