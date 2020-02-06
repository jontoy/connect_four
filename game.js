
class Game {
    // Class to represent a game of connect four
    constructor(root, token, resetBtn, winnerBanner, numRows=6,numCols=7){
        this.root = root;
        this.size = {numRows, numCols};
        const gameBoard = this.initializeBoardHTML();
        this.openings = gameBoard.querySelectorAll('.opening');
        this.gameRows = gameBoard.querySelectorAll('.game-row');
        this.enableOpenings();
        this.token = token;
        this.winnerBanner = winnerBanner;
        this.winnerBanner.classList.add('hidden');
        this.resetBtn = resetBtn;
        resetBtn.addEventListener('click', (e) => {
            this.reset();
        })
        //create internally used game board
        this.board = []
        for(let i = 0;i<numCols;i++){
            this.board.push(new Column(numRows))
        }
        this.isPlayer1 = true;
        this.isOver = false;
        this.winner = null;
    }
    initializeBoardHTML(){
        //Create game board HTML elements
        //returns gameBoard table HTML element
        const gameBoard = document.createElement('table');
        const tHead = document.createElement('thead');
        gameBoard.append(tHead);
        const tHeadTr = document.createElement('tr');
        tHead.append(tHeadTr);
        tHeadTr.classList.add('opening-row');
        for(let col=0;col<this.size.numCols;col++){
            const opening = document.createElement('th');
            opening.innerHTML = `<div class="opening" data-col="${col}"></div>`;
            tHeadTr.append(opening);
        }
        const tBody = document.createElement('tbody');
        gameBoard.append(tBody);
        for(let row=0;row<this.size.numRows;row++){
            const newRow = document.createElement('tr');
            newRow.classList.add('game-row');
            for(let col=0;col<this.size.numCols;col++){
                const newCell = document.createElement('td');
                newCell.innerHTML = `<div class="cell"></div>`;
                newRow.append(newCell);
            }
            tBody.append(newRow);
        }
        this.root.append(gameBoard);
        return gameBoard;
    }
    enableOpenings(){
        // enable events for dropping token into columns
        for (let opening of this.openings){
            opening.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
            });
            opening.addEventListener('drop', (e) => {
                if(this.isOver) return;
                const targetCol = parseInt(e.target.dataset.col);
                if(this.isColumnFull(targetCol)) return;
                const targetRow = this.board[targetCol].lastUnfilledRow;
                const player = this.isPlayer1 ? 'player-1' : 'player-2';
                this.addPiece(targetRow, targetCol);
                this.gameRows[targetRow].children[targetCol].firstElementChild.classList.add(player);
                if(this.isColumnFull(targetCol)){
                    e.target.classList.add('full');
                }
                if(this.isOver){
                    for(let opening of this.openings){
                        opening.classList.add('full');
                    }
                }
                this.toggleActivePlayer();
            });
        }
    }
    toggleActivePlayer(){
        // swap active player at end of turn
        this.token.classList.toggle('player-1');
        this.token.classList.toggle('player-2');
        this.isPlayer1 = !this.isPlayer1;
    }
    addPiece(rowIdx, colIdx){
        // add token to board at index (rowIdx, colIdx)
        const playerId = this.isPlayer1 ? 1 : 2;
        this.setVal(rowIdx, colIdx, playerId);
        this.board[colIdx].decrementUnfilledRow();
        if(this.checkWinnerFull()){
            this.isOver = true;
            this.winner = this.isPlayer1 ? 'Player 1' : 'Player 2';
            this.displayVictoryMessage();
        }
    }

    getVal(rowIdx, colIdx){
        // filter out invalid inputs
        if(colIdx >= this.size.numCols || colIdx < 0) return;
        if(rowIdx >= this.size.numRows || rowIdx < 0) return;
        // retrieve board entry at index (rowIdx, colIdx)
        return this.board[colIdx].getVal(rowIdx);
    }
    setVal(rowIdx, colIdx, value){
        // filter out invalid inputs
        if(colIdx >= this.size.numCols || colIdx < 0) return;
        if(rowIdx >= this.size.numRows || rowIdx < 0) return;
        // set board entry at index (rowIdx, colIdx)
        this.board[colIdx].setVal(rowIdx, value);
    }
    reset(){
        // reset game to initial state
        this.root.innerHTML = '';
        this.winnerBanner.innerText = '';
        this.winnerBanner.classList.add('hidden');
        const gameBoard = this.initializeBoardHTML();
        this.openings = gameBoard.querySelectorAll('.opening');
        this.gameRows = gameBoard.querySelectorAll('.game-row');
        this.enableOpenings();
        this.isOver = false;
        this.isPlayer1 = true;
        this.token.classList.add('player-1');
        this.token.classList.remove('player-2');
        this.winner = null;
        for(let col of this.board){
            col.reset();
        }
        for(let opening of this.openings){
            opening.classList.remove('full');
        }
    }
    getFullSlots(){
        // check which Columns of board are fully filled
        return this.board.map((col) => col.isFull)
    }

    isColumnFull(colIdx){
        // check if Column at index colIdx of board is full
        return this.board[colIdx].isFull
    }
    getMatrixForm(){
        // return matrix representation of Game's board
        return this.board.map((col) => col.contents);
    }
    displayVictoryMessage(){
        // handle display of victory message
        this.winnerBanner.classList.remove('hidden');
        this.winnerBanner.innerText = `${this.winner} Wins!!!`;
    }
    checkWinnerFull(){
        // check if entire board is in a winner state
        for(let i=0;i<this.size.numRows-3;i++){
            for(let j=0;j<this.size.numCols-3;j++){
                if(this.checkWinner4x4(i,j)){
                    return true
                }
            }
        }
        return false
    }
    checkWinner4x4(rowStart, colStart){
        // check if 4x4 section of board starting at index
        // (rowStart, colStart) is in a winning state
        if(this.checkCols4x4(rowStart, colStart)){
            return true
        }
        if(this.checkRows4x4(rowStart, colStart)){
            return true
        }
        if(this.checkDiagonals4x4(rowStart, colStart)){
            return true
        }
        return false
    }
    checkCols4x4(rowStart, colStart){
        // check if 4x4 section of board starting at index
        // (rowStart, colStart) has winning colums
        for(let col=colStart;col<colStart+4;col++){
            if(Game.isWinner1x4(this.returnCol1x4(rowStart, col))){
                return true
            }
        }
        return false;
    }
    checkRows4x4(rowStart, colStart){
        // check if 4x4 section of board starting at index
        // (rowStart, colStart) has winning rows
        for(let row=rowStart;row<rowStart+4;row++){
            if(Game.isWinner1x4(this.returnRow1x4(row, colStart))){
                return true
            }
        }
        return false;
    }
    checkDiagonals4x4(rowStart, colStart){
        // check if 4x4 section of board starting at index
        // (rowStart, colStart) has winning diagonals
        if(Game.isWinner1x4(this.returnDiagonalA1x4(rowStart, colStart))){
            return true
        }
        if(Game.isWinner1x4(this.returnDiagonalB1x4(rowStart+3, colStart))){
            return true
        }
        return false
    }
    returnCol1x4(rowStart, col){
        // return an 1x4 Array slice of the game board in the 
        // column direction starting at index (rowStart, col)
        if(rowStart>this.size.numRows-4) return
        if(col > this.size.numCols) return
        return this.board[col].contents.slice(rowStart,rowStart+4);
    }
    returnRow1x4(row, colStart){
        // return an 1x4 Array slice of the game board in the 
        // row direction starting at index (rowStart, col)
        if(colStart>this.size.numCols-4) return
        if(row > this.size.numRows) return
        return this.getMatrixForm().slice(colStart, colStart+4).map((col) => (col[row]))
    }

    returnDiagonalA1x4(rowStart, colStart){
        //returns the 1x4 array of the "\" diagonal
        //of a 4x4 matrix-array
        if(colStart>this.size.numCols-4) return
        if(rowStart > this.size.numRows-4) return

        const diagonalValues = []
        for (let i = 0; i<4;i++){
            diagonalValues.push(this.getVal(rowStart+i,colStart+i));
        }
        return diagonalValues
    }
    returnDiagonalB1x4(rowStart, colStart){
        //returns a 1x4 array of the "/" diagonal
        //of a 4x4 matrix-array
        if(colStart>this.size.numCols-4) return;
        if(rowStart < 3) return;

        const diagonalValues = []
        for (let i = 0; i<4;i++){
            diagonalValues.push(this.getVal(rowStart-i,colStart+i));
        }
        return diagonalValues
    }
    static isWinner1x4(arr){
        // check if given array corresponds to a winning state
        // (user has successfully connected 4)
        if(arr.length < 4) return false;
        return arr.every((val, i, arr) => ((val === arr[0]) && ([1,2].includes(val))));
    }
}