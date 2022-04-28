const ws = new WebSocket(`ws://localhost:8080`);

const Sequence = () => {
  const [board, setBoard] = React.useState([[]]);
  const [positionBoard, setPositionBoard] = React.useState([[]]);
  const [cards, setCards] = React.useState([]);
  const [deck, setDeck] = React.useState([]);
  const [start, setStart] = React.useState(false);
  const [error, setError] = React.useState([
    ["You do not posses the card in your deck."],
    ["This is not your turn."],
  ]);
  const [showerr, setShowerr] = React.useState(false);
  const [errorCode, setErrorCode] = React.useState(-5);
  const [playerId, setPlayerId] = React.useState(0);
  const [teamColor, setTeamColor] = React.useState("");
  const [turn, setTurn] = React.useState(0);
  const [jacks, setJacks] = React.useState([
    ["card rank-j hearts"],
    ["card rank-j spades"],
    ["card rank-j diams"],
    ["card rank-j clubs"],
  ]);
  const [over, setOver] = React.useState(false);
  const [winner, setWinner] = React.useState("");
  const [winMessage, setWinMessage] = React.useState("");
  const [renewedDeck, setRenewedDeck] = React.useState(false);
  const [emptyAlertSent, setEmptyAlertSent] = React.useState(false);
  const [message, setMessage] = React.useState("");
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data["type"]) {
      case "newboard":
        setBoard(data.board);
        setPositionBoard(data.positionBoard);
        setPlayerId(data.playerId + 1);
        setDeck(data.client);
        setTeamColor(data.color);
        setTurn(data.turn);
        setStart(true);
        break;
      case "positionUpdate":
        setPositionBoard(data.positionBoard);
        setTurn(data.turn);
        setMessage("Player " + data.turn + " turn");
        break;
      case "winner":
        let winner = data.winningTeam;
        if (winner == "g") {
          setMessage("green" + " won!");
        } else {
          setMessage("blue" + " won!");
        }
        setOver(true);
        setShowerr(false);
        break;
      case "newDeck":
        setDeck(data.deck);
        setRenewedDeck(true);
        break;
      case "tie":
        setOver(true);
        setWinMessage("Tie!");
        setMessage("Tie!");
        break;
      default:
    }
  };

  let diamondSign = "♦";
  let heartSign = "♥";
  let spadesSign = "♠";
  let clubsSign = "♣";
  // function to dynamically create cards
  // recieves card rank suit from the mapping of the board array
  const boardToDisplay = (card, i, j) => {
    if (card == "card back") {
      let cardToDisplay = (
        <div>
          <li>
            <div className="card back">
              <span className="rank"></span>
            </div>
          </li>
        </div>
      );
      return cardToDisplay;
    } else if (positionBoard[i][j] == "g") {
      let cardToDisplay = (
        <div>
          <li>
            <div className="card">
              <div className="green"></div>
            </div>
          </li>
        </div>
      );
      return cardToDisplay;
    } else if (positionBoard[i][j] == "b") {
      let cardToDisplay = (
        <div>
          <li>
            <div className="card">
              <div className="blue"></div>
            </div>
          </li>
        </div>
      );
      return cardToDisplay;
    } else {
      let data = card.split(" ");
      let rank = data[1].split("-")[1];
      let suit = data[2];
      let suits = {
        diams: diamondSign,
        hearts: heartSign,
        spades: spadesSign,
        clubs: clubsSign,
      };
      if (positionBoard[i][j] == "-") {
        let cardToDisplay = (
          <div>
            <li>
              <div className={card} onClick={() => cardClicked(card, i, j)}>
                <span className="rank">{rank}</span>
                <span className="suit">{suits[suit]}</span>
              </div>
            </li>
          </div>
        );
        return cardToDisplay;
      }
    }
  };
  const cardClicked = (cardSelected, i, j) => {
    let jack = false;
    // if deck has a card from jacks
    for (let i = 0; i < deck.length; i++) {
      for (let j = 0; j < jacks.length; j++) {
        if (deck[i] == jacks[j]) {
          jack = true;
        }
      }
    }
    if (
      over == false &&
      (jack == true ||
        (deck.includes(cardSelected) &&
          positionBoard[i][j] == "-" &&
          turn == playerId))
    ) {
      if (jack == false) {
        let newDeck = deck.filter((card) => card !== cardSelected);
        setDeck(newDeck);
        let check = 0;
        for (let i = 0; i < deck.length; i++) {
          if (deck[i] == "card back") {
            check++;
          }
        }
        if (check == deck.length - 1 && renewedDeck == false) {
          ws.send(
            JSON.stringify({
              type: "request new deck",
            })
          );
        }
      } else if (jack == true) {
        let jackPos = i;
        for (let i = 0; i < deck.length; i++) {
          for (let j = 0; j < jacks.length; j++) {
            if (deck[i] == jacks[j]) {
              jackPos = i;
              break;
            }
          }
        }
        let newDeck = deck.filter((card, index) => index !== jackPos);
        newDeck.push("card back");
        setDeck(newDeck);
        let check = 0;
        for (let i = 0; i < deck.length; i++) {
          if (deck[i] == "card back") {
            check++;
          }
        }

        if (check == deck.length - 1 && renewedDeck == false) {
          ws.send(
            JSON.stringify({
              type: "request new deck",
            })
          );
        }
      }
      ws.send(
        JSON.stringify({
          type: "cardclicked",
          row: i,
          column: j,
          color: teamColor,
          turn: turn,
        })
      );
      setShowerr(false);
    } else {
      if (over != true) {
        if (turn != playerId) {
          setErrorCode(1);
        }
        if (!deck.includes(cardSelected) && turn == playerId) {
          setErrorCode(0);
        }
        setShowerr(true);
      }
    }
  };
  const generateClientCard = (card) => {
    let data = card.split(" ");
    let rank = data[1].split("-")[1];
    let suit = data[2];
    let suits = {
      diams: diamondSign,
      hearts: heartSign,
      spades: spadesSign,
      clubs: clubsSign,
    };
    let cardToDisplay = (
      <div>
        <li>
          <a className={card} onClick={() => cardClicked(card, i, j)}>
            <span className="rank">{rank}</span>
            <span className="suit">{suits[suit]}</span>
          </a>
        </li>
      </div>
    );

    return cardToDisplay;
  };
  const deckEmpty = () => {
    let check = true;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i] != "card back") {
        check = false;
      }
    }
    if (check == true && renewedDeck == true) {
      ws.send(
        JSON.stringify({
          type: "Out of cards",
          player: playerId,
        })
      );
    }
  };
  if (renewedDeck == true) {
    deckEmpty();
  }

  return (
    <div>
      <div className="container">
        {start ? (
          board.map((row, i) => (
            <div>
              <div className="playingCards fourColours rotateHand">
                <ul className="table">
                  {row.map((card, j) => boardToDisplay(card, j, i))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <div className="container">
        <div>
          <h1>Your Cards:</h1>
        </div>
        {start ? (
          deck.map((card) => (
            <div className="playingCards fourColours rotateHand">
              <ul className="table">{generateClientCard(card)}</ul>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
        {showerr ? (
          <div className="text_box">{error[errorCode]}</div>
        ) : (
          <div className="text_box"> {message} </div>
        )}
        {<div className={"color " + teamColor}></div>}
      </div>
    </div>
  );
};

ReactDOM.render(<Sequence />, document.querySelector(`#root`));
