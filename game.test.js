let myTestGame;

describe("Game functionality tests", function() {
    beforeEach(function () {
      // initialization logic
      myTestGame = new Game();
    });

    it('toggleActivePlayer() should swap isPlayer1 and token class', function () {
      myTestGame.toggleActivePlayer();
      expect(myTestGame.isPlayer1).toEqual(false);
      myTestGame.toggleActivePlayer();
      expect(myTestGame.isPlayer1).toEqual(true);
    });
    it('setVal() should set correct value at correct indices', function () {
      myTestGame.setVal(3,2,1);
      expect(myTestGame.board[2].contents[3]).toEqual(1);
    });
    it('setVal() should reject values other than 1 and 2', function () {
      myTestGame.setVal(3,2,10);
      expect(myTestGame.getMatrixForm()).toEqual(
        [[0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]]
      );
      myTestGame.setVal(3,2,'blue');
      expect(myTestGame.getMatrixForm()).toEqual(
        [[0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]]
      );
    });
    it('setVal() should reject invalid indices', function () {
      myTestGame.setVal(10,2,1);
      expect(myTestGame.getMatrixForm()).toEqual(
          [[0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0]]
      );
    });

    it('getVal() should return correct value at correct indices', function () {
      myTestGame.board[2].contents = [4,5,2,1,10,16];
      expect(myTestGame.getVal(4,2)).toEqual(10);
    });
    it('getVal() should return undefined for invalid indices', function () {
      expect(myTestGame.getVal(10,2)).toEqual(undefined);
      expect(myTestGame.getVal(2,20)).toEqual(undefined);
      expect(myTestGame.getVal(10,20)).toEqual(undefined);
    });

    it('addPiece() should place correct player token in correct spot', function () {
        myTestGame.addPiece(5,0);
        myTestGame.toggleActivePlayer();
        myTestGame.addPiece(4,0);
        expect(myTestGame.board[0].contents).toEqual([0,0,0,0,2,1]);
    });
    it('addPiece() should end game at winning move', function () {
        expect(myTestGame.isOver).toEqual(false);
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        myTestGame.addPiece(2,0);
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
    it('getMatrixForm() should return matrix representation of board state', function () {
        myTestGame.setVal(3,2,1);
        expect(myTestGame.getMatrixForm()).toEqual(
            [[0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,1,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0]]
          );
    });
    it('checkWinnerFull() identifies winning board', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        myTestGame.addPiece(2,0);
        expect(myTestGame.checkWinnerFull()).toEqual(true);
    });
    it('checkWinnerFull() identifies non-winning board', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        expect(myTestGame.checkWinnerFull()).toEqual(false);
    });
    it('checkWinner4x4() identifies winning board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        myTestGame.addPiece(2,0);
        expect(myTestGame.checkWinner4x4(2,0)).toEqual(true);
    });
    it('checkWinner4x4() identifies non-winning board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        expect(myTestGame.checkWinner4x4(2,0)).toEqual(false);
    });
    it('checkCols4x4() identifies winning columns in board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        myTestGame.addPiece(2,0);
        expect(myTestGame.checkCols4x4(2,0)).toEqual(true);
    });
    it('checkCols4x4() identifies non-winning columns in board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        expect(myTestGame.checkCols4x4(2,0)).toEqual(false);
    });
    it('checkRows4x4() identifies winning rows in board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(5,1);
        myTestGame.addPiece(5,2);
        myTestGame.addPiece(5,3);
        expect(myTestGame.checkRows4x4(2,0)).toEqual(true);
    });
    it('checkRows4x4() identifies non-winning rows in board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        myTestGame.addPiece(2,0);
        expect(myTestGame.checkRows4x4(2,0)).toEqual(false);
    });
    it('checkDiagonals4x4() identifies winning diagonals in board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,1);
        myTestGame.addPiece(3,2);
        myTestGame.addPiece(2,3);
        expect(myTestGame.checkDiagonals4x4(2,0)).toEqual(true);
    });
    it('checkDiagonals4x4() identifies non-winning diagonals in board segment', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        myTestGame.addPiece(2,0);
        expect(myTestGame.checkDiagonals4x4(2,0)).toEqual(false);
    });
    it('returnCol1x4() returns appropriate column segment in board', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(4,0);
        myTestGame.addPiece(3,0);
        expect(myTestGame.returnCol1x4(2,0)).toEqual([0,1,1,1]);
    });
    it('returnRow1x4() returns appropriate row segment in board', function () {
        myTestGame.addPiece(5,0);
        myTestGame.addPiece(5,1);
        myTestGame.addPiece(5,3);
        expect(myTestGame.returnRow1x4(5,0)).toEqual([1,1,0,1]);
    });
    it('returnDiagonalA1x4() returns appropriate diagonal segment in board', function () {
        myTestGame.addPiece(2,0);
        myTestGame.addPiece(3,1);
        myTestGame.addPiece(4,1);
        expect(myTestGame.returnDiagonalA1x4(2,0)).toEqual([1,1,0,0]);
    });
    it('returnDiagonalB1x4() returns appropriate diagonal segment in board', function () {
        myTestGame.addPiece(2,0);
        myTestGame.addPiece(3,1);
        myTestGame.addPiece(4,1);
        expect(myTestGame.returnDiagonalB1x4(5,0)).toEqual([0,1,0,0]);
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
    // afterEach(function () {
    //     // tear down logic
    //     myTestGame.reset();
    // });
  });