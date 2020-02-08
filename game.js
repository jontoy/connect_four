
class Game {
    // Class to represent a game of connect four
    constructor(numRows=6,numCols=7){
        this.size = {numRows, numCols};
        this.board = []
        for(let i = 0;i<numCols;i++){
            this.board.push(new Column(numRows))
        }
        this.isPlayer1 = true;
        this.scores = {p1:0, p2:0};
        this.isOver = false;
        this.winner = null;
    }
    toggleActivePlayer(){
        // swap active player at end of turn
        this.isPlayer1 = !this.isPlayer1;
    }
    addPiece(rowIdx, colIdx){
        // add token to board at index (rowIdx, colIdx)
        const playerId = this.isPlayer1 ? 1 : 2;
        this.setVal(rowIdx, colIdx, playerId);
        this.board[colIdx].decrementUnfilledRow();
    }
    updateWinnerState(){
        if(this.checkWinnerFull()){
            this.isOver = true;
            if(this.isPlayer1){
                this.winner = 'Player 1';
                this.scores.p1 += 1;
            } else{
                this.winner = 'Player 2';
                this.scores.p2 += 1;
            }
        }
    }

    getVal(rowIdx, colIdx){
        // filter out invalid inputs
        if(colIdx >= this.size.numCols || colIdx < 0){
            throw new Error('invalid column index');
        }
        if(rowIdx >= this.size.numRows || rowIdx < 0){
            throw new Error('invalid row index');
        }
        // retrieve board entry at index (rowIdx, colIdx)
        return this.board[colIdx].getVal(rowIdx);
    }
    setVal(rowIdx, colIdx, value){
        // filter out invalid inputs
        if(colIdx >= this.size.numCols || colIdx < 0){
            throw new Error('invalid column index');
        }
        if(rowIdx >= this.size.numRows || rowIdx < 0){
            throw new Error('invalid row index');
        }
        // set board entry at index (rowIdx, colIdx)
        this.board[colIdx].setVal(rowIdx, value);
    }
    reset(){
        // reset game to initial state
        this.isOver = false;
        this.isPlayer1 = true;
        this.winner = null;
        for(let col of this.board){
            col.reset();
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