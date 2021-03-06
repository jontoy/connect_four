let myTestGame;

describe("Game functionality tests", function() {
    beforeEach(function () {
      // initialization logic
      myTestGame = new Game();
    });
    it('constructor correctly sets game to initial state', function () {
        expect(myTestGame.isPlayer1).toEqual(true);
        expect(myTestGame.isOver).toEqual(false);
        expect(myTestGame.winner).toEqual(null);
        expect(myTestGame._getMatrixForm()).toEqual(
            [[0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0]]
        );
    })
    it('toggleActivePlayer() should swap isPlayer1 and token class', function () {
      myTestGame.toggleActivePlayer();
      expect(myTestGame.isPlayer1).toEqual(false);
      myTestGame.toggleActivePlayer();
      expect(myTestGame.isPlayer1).toEqual(true);
    });
    it('_setVal() should set correct value at correct indices', function () {
      myTestGame._setVal(3,2,1);
      expect(myTestGame.board[2].contents[3]).toEqual(1);
    });
    
    it('_setVal() should reject values other than 1 and 2', function () {
      myTestGame._setVal(3,2,10);
      expect(myTestGame._getMatrixForm()).toEqual(
        [[0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]]
      );
      myTestGame._setVal(3,2,'blue');
      expect(myTestGame._getMatrixForm()).toEqual(
        [[0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]]
      );
    });
    it('_setVal() should throw error for invalid indices', function () {
        expect(function(){myTestGame._setVal(10,2,1)}).toThrowError('invalid row index');
        expect(function(){myTestGame._setVal(2,20,1)}).toThrowError('invalid column index');
        expect(function(){myTestGame._setVal(10,20,1)}).toThrowError('invalid column index');
      });

    it('getVal() should return correct value at correct indices', function () {
      myTestGame.board[2].contents = [4,5,2,1,10,16];
      expect(myTestGame.getVal(4,2)).toEqual(10);
    });
    it('getVal() should throw error for invalid indices', function () {
      expect(function(){myTestGame.getVal(10,2)}).toThrowError('invalid row index');
      expect(function(){myTestGame.getVal(2,20)}).toThrowError('invalid column index');
      expect(function(){myTestGame.getVal(10,20)}).toThrowError('invalid column index');
    });

    it('addPiece() should place correct player token in correct spot', function () {
        myTestGame.addPiece(5,0);
        myTestGame.toggleActivePlayer();
        myTestGame.addPiece(4,0);
        expect(myTestGame.board[0].contents).toEqual([0,0,0,0,2,1]);
    });
    it('updateWinnerState() should end game if board has been won', function(){
        myTestGame.updateWinnerState();
        expect(myTestGame.isOver).toEqual(false);
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        myTestGame.addPiece(2,0);
        myTestGame.updateWinnerState();
        expect(myTestGame.isOver).toEqual(true);
        expect(myTestGame.winner).toEqual('Player 1');
    });

    it('getFullSlots() should return boolean array of filled columns', function () {
        expect(myTestGame.getFullSlots()).toEqual([false, false, false, false, false, false, false]);
        myTestGame.board[3].isFull = true;
        expect(myTestGame.getFullSlots()).toEqual([false, false, false, true, false, false, false]);
    });
    it('isColumnFull() should return boolean for filled column', function () {
        expect(myTestGame.isColumnFull(3)).toEqual(false);
        myTestGame.board[3].isFull = true;
        expect(myTestGame.isColumnFull(3)).toEqual(true);
    });
    it('_getMatrixForm() should return matrix representation of board state', function () {
        myTestGame._setVal(3,2,1);
        expect(myTestGame._getMatrixForm()).toEqual(
            [[0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,1,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0]]
          );
    });
    it('_checkWinnerFull() identifies winning board', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        myTestGame.addPiece(2,0);
        expect(myTestGame._checkWinnerFull()).toEqual(true);
    });
    it('_checkWinnerFull() identifies non-winning board', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        expect(myTestGame._checkWinnerFull()).toEqual(false);
    });
    it('_checkWinner4x4() identifies winning board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        myTestGame.addPiece(2,0);
        expect(myTestGame._checkWinner4x4(2,0)).toEqual(true);
    });
    it('_checkWinner4x4() identifies non-winning board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        expect(myTestGame._checkWinner4x4(2,0)).toEqual(false);
    });
    it('_checkCols4x4() identifies winning columns in board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        myTestGame.addPiece(2,0);
        expect(myTestGame._checkCols4x4(2,0)).toEqual(true);
    });
    it('_checkCols4x4() identifies non-winning columns in board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        expect(myTestGame._checkCols4x4(2,0)).toEqual(false);
    });
    it('_checkRows4x4() identifies winning rows in board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(5,1);
        myTestGame.addPiece(5,2);
        myTestGame.addPiece(5,3);
        expect(myTestGame._checkRows4x4(2,0)).toEqual(true);
    });
    it('_checkRows4x4() identifies non-winning rows in board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        myTestGame.addPiece(2,0);
        expect(myTestGame._checkRows4x4(2,0)).toEqual(false);
    });
    it('_checkDiagonals4x4() identifies winning diagonals in board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,1);
        myTestGame.addPiece(3,2);
        myTestGame.addPiece(2,3);
        expect(myTestGame._checkDiagonals4x4(2,0)).toEqual(true);
    });
    it('_checkDiagonals4x4() identifies non-winning diagonals in board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        myTestGame.addPiece(2,0);
        expect(myTestGame._checkDiagonals4x4(2,0)).toEqual(false);
    });
    it('_returnCol1x4() returns appropriate column segment in board', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        expect(myTestGame._returnCol1x4(2,0)).toEqual([0,1,1,1]);
    });
    it('_returnRow1x4() returns appropriate row segment in board', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(5,1);
        myTestGame.addPiece(5,3);
        expect(myTestGame._returnRow1x4(5,0)).toEqual([1,1,0,1]);
    });
    it('_returnDiagonalA1x4() returns appropriate diagonal segment in board', function () {
        myTestGame.addPiece(2,0);
        myTestGame.addPiece(3,1);
        myTestGame.addPiece(4,1);
        expect(myTestGame._returnDiagonalA1x4(2,0)).toEqual([1,1,0,0]);
    });
    it('_returnDiagonalB1x4() returns appropriate diagonal segment in board', function () {
        myTestGame.addPiece(2,0);
        myTestGame.addPiece(3,1);
        myTestGame.addPiece(4,1);
        expect(myTestGame._returnDiagonalB1x4(5,0)).toEqual([0,1,0,0]);
    });
    it('isWinner1x4() identifies winning arrays', function () {
        expect(Game.isWinner1x4([1,1,1,1])).toEqual(true);
        expect(Game.isWinner1x4([2,2,2,2])).toEqual(true);
    });
    it('isWinner1x4() identifies non-winning arrays', function () {
        expect(Game.isWinner1x4([1,1,2,1])).toEqual(false);
        expect(Game.isWinner1x4([2,2,2,0])).toEqual(false);
        expect(Game.isWinner1x4([0,0,0,0])).toEqual(false);
    });
    it('reset() correctly sets game to initial state', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        myTestGame.addPiece(2,0);
        myTestGame.updateWinnerState();
        myTestGame.reset();
        expect(myTestGame.isPlayer1).toEqual(true);
        expect(myTestGame.isOver).toEqual(false);
        expect(myTestGame.winner).toEqual(null);
        expect(myTestGame._getMatrixForm()).toEqual(
            [[0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0]]
        );
    });
  });