let myColumn;

describe("Column functionality tests", function() {
    beforeEach(function () {
      // initialization logic
      myColumn = new Column();
    });

    it('setVal() should add correct value to correct index', function () {
      myColumn.setVal(3,2);
      expect(myColumn.contents).toEqual([0,0,0,2,0,0]);
    });
    it('setVal() should reject values other than 1 and 2', function () {
      myColumn.setVal(3,10);
      expect(myColumn.contents).toEqual([0,0,0,0,0,0]);
      myColumn.setVal(3,'blue');
      expect(myColumn.contents).toEqual([0,0,0,0,0,0]);
    });
    it('setVal() should throw errors for invalid indices', function () {
      expect(function(){myColumn.setVal(20,1)}).toThrowError('invalid index');
    });

    it('getVal() should return correct value at correct index', function () {
      myColumn.contents = [4,5,2,1,10,16];
      expect(myColumn.getVal(4)).toEqual(10);
    });
    it('getVal() should return undefined for invalid indices', function () {
      expect(function(){myColumn.getVal(10)}).toThrowError('invalid index');
    });

    it('decrementUnfilledRow() should update lastUnfilledRow correctly', function () {
      myColumn.decrementUnfilledRow();
      expect(myColumn.lastUnfilledRow).toEqual(4);
    });

    it('decrementUnfilledRow() should update isFull correctly', function () {
      myColumn.decrementUnfilledRow();
      expect(myColumn.isFull).toEqual(false);
      myColumn.decrementUnfilledRow();
      myColumn.decrementUnfilledRow();
      myColumn.decrementUnfilledRow();
      myColumn.decrementUnfilledRow();
      myColumn.decrementUnfilledRow();
      expect(myColumn.isFull).toEqual(true);
    });

    it('reset() should return values to initial state', function () {
      myColumn.setVal(3,2);
      myColumn.decrementUnfilledRow();
      myColumn.decrementUnfilledRow();
      myColumn.decrementUnfilledRow();
      myColumn.decrementUnfilledRow();
      myColumn.decrementUnfilledRow();
      myColumn.decrementUnfilledRow();
      myColumn.reset();
      expect(myColumn.contents).toEqual([0,0,0,0,0,0]);
      expect(myColumn.lastUnfilledRow).toEqual(5);
      expect(myColumn.isFull).toEqual(false);
    });
  });