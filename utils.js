const createConnectFour = (
    {root, token, resetBtn, winnerBanner}, 
    numRows=6, 
    numCols=7
    ) => {

    const createBoardHTML = () => {
        // creates and returns HTML representation of board
        const gameBoard = document.createElement('table');
        const tHead = document.createElement('thead');
        gameBoard.append(tHead);
        const tHeadTr = document.createElement('tr');
        tHead.append(tHeadTr);
        tHeadTr.classList.add('opening-row');
        for(let col=0;col<numCols;col++){
            const opening = document.createElement('th');
            opening.innerHTML = `<div class="opening" data-col="${col}"></div>`;
            tHeadTr.append(opening);
        }
        const tBody = document.createElement('tbody');
        gameBoard.append(tBody);
        for(let row=0;row<numRows;row++){
            const newRow = document.createElement('tr');
            newRow.classList.add('game-row');
            for(let col=0;col<numCols;col++){
                const newCell = document.createElement('td');
                newCell.innerHTML = `<div class="cell"></div>`;
                newRow.append(newCell);
            }
            tBody.append(newRow);
        }
        return gameBoard;
    }
    const resetBoardHTML = () => {
        // reset board HTML elements to initial state
        root.innerHTML = '';
        winnerBanner.innerText = '';
        winnerBanner.classList.add('hidden');
        gameBoard = createBoardHTML();
        root.append(gameBoard);
        openings = gameBoard.querySelectorAll('.opening');
        gameRows = gameBoard.querySelectorAll('.game-row');
        enableOpenings();
        token.classList.add('player-1');
        token.classList.remove('player-2');
        for(let opening of openings){
            opening.classList.remove('full');
        }
    }
    const togglePlayer = () => {
        // toggles active player of game
        token.classList.toggle('player-1');
        token.classList.toggle('player-2');
        newGame.toggleActivePlayer();
    }
    const displayVictoryMessage = () => {
        // handle display of victory message
        winnerBanner.classList.remove('hidden');
        winnerBanner.innerText = `${newGame.winner} Wins!!!`;
    }
    const enableOpenings = () => {
        // enable events for dropping token into columns
        for (let opening of openings){
            opening.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
            });
            opening.addEventListener('drop', (e) => {
                if(newGame.isOver) return;
                const targetCol = parseInt(e.target.dataset.col);
                if(newGame.isColumnFull(targetCol)) return;
                const targetRow = newGame.board[targetCol].lastUnfilledRow;
                const player = newGame.isPlayer1 ? 'player-1' : 'player-2';
                newGame.addPiece(targetRow, targetCol);
                gameRows[targetRow].children[targetCol].firstElementChild.classList.add(player);
                if(newGame.isColumnFull(targetCol)){
                    e.target.classList.add('full');
                }
                if(newGame.isOver){
                    for(let opening of openings){
                        opening.classList.add('full');
                    }
                    displayVictoryMessage();
                }
                togglePlayer();
            });
        }
    }

    winnerBanner.classList.add('hidden');
    const newGame = new Game();
    let gameBoard = createBoardHTML();
    root.append(gameBoard);
    let openings = gameBoard.querySelectorAll('.opening');
    let gameRows = gameBoard.querySelectorAll('.game-row');


    enableOpenings();
    resetBtn.addEventListener('click', (e) => {
        resetBoardHTML();
        newGame.reset();
    })
}

