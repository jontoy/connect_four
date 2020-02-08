const createConnectFour = (
    {root, token, resetBtn, winnerBanner, scoreboard}, 
    numRows=6, 
    numCols=7
    ) => {
    // creates interactable game of Connect Four and 
    // returns associated Game class instance
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
    const updateScores = () => {
        // update the total games won by each player
        // on the scoreboard
        const p1ScoreArea = scoreboard.querySelector('.score1');
        const p2ScoreArea = scoreboard.querySelector('.score2');
        p1ScoreArea.innerText = newGame.scores.p1;
        p2ScoreArea.innerText = newGame.scores.p2;
    }
    const enableOpenings = () => {
        // enable draggable token to be dropped into openings
        interact('.opening').dropzone({
        // only accept elements matching this CSS selector
        accept: '.token',
        // Require a 75% element overlap for a drop to be possible
        overlap: 0.75,
    
        // listen for drop related events:
        ondropactivate: function (e) {
        // add active dropzone feedback
        e.target.classList.add('drop-active')
        },
        ondragenter: function (e) {
        const dropzoneElement = e.target
        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target')
        },
        ondragleave: function (e) {
        // remove the drop feedback style
        e.target.classList.remove('drop-target')
        },
        ondrop: function (e) {
            //token dropping logic
            if(newGame.isOver) return;
            const targetCol = parseInt(e.target.dataset.col);
            if(newGame.isColumnFull(targetCol)) return;
            const targetRow = newGame.board[targetCol].lastUnfilledRow;
            const player = newGame.isPlayer1 ? 'player-1' : 'player-2';
            newGame.addPiece(targetRow, targetCol);
            newGame.updateWinnerState();
            gameRows[targetRow].children[targetCol].firstElementChild.classList.add(player);
            if(newGame.isColumnFull(targetCol)){
                e.target.classList.add('full');
            }
            if(newGame.isOver){
                for(let opening of openings){
                    opening.classList.add('full');
                }
                updateScores();
                displayVictoryMessage();
            }
            togglePlayer();
            resetDraggablePos(e);
        },
        ondropdeactivate: function (e) {
        // remove active dropzone feedback
        e.target.classList.remove('drop-active')
        e.target.classList.remove('drop-target')
        }
    })
    }
    interact('.token')
    .draggable({
        inertia: true,
        autoScroll: true,
        onmove: dragMoveListener
    })

    winnerBanner.classList.add('hidden');
    const newGame = new Game(numRows, numCols);
    let gameBoard = createBoardHTML();
    root.append(gameBoard);
    let openings = gameBoard.querySelectorAll('.opening');
    let gameRows = gameBoard.querySelectorAll('.game-row');

    
    enableOpenings();
    resetBtn.addEventListener('click', (e) => {
        resetBoardHTML();
        newGame.reset();
    })
    return newGame;
}

function dragMoveListener (event) {
    const target = event.target
    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
      
    // translate the element
    target.style.webkitTransform =
    target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)'
      
    // update the position attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
}

function resetDraggablePos (e) {
    //resets the position of draggabel object to
    //its original position
    const draggableElement = e.relatedTarget;
    draggableElement.style.transform = 'translate(0,0)';
    draggableElement.setAttribute('data-x', 0);
    draggableElement.setAttribute('data-y', 0);
    
}