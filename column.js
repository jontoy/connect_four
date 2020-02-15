
class Column {
    // Class to represent a column in a connect four game
    constructor(numRows=6) {
        this.contents = Array(numRows)
        this.reset();
    }
    reset(){
        // resets Column's values to initial state
        this.contents.fill(0);
        this.lastUnfilledRow = this.contents.length - 1;
        this.isFull = !(this.contents.length > 0);
    }
    getVal(index){
        // Get Column's contents at index
        if (index > this.contents.length){
            throw new Error('invalid index');
        }
        return this.contents[index];
    }
    _setVal(index, value){
        // Set Column's contents at index
        if (index > this.contents.length){
            throw new Error('invalid index');
        }
        if (![1,2].includes(value)){
            return undefined
        }
        this.contents[index] = value;
    }

    _decrementUnfilledRow(){
        // Decrements lastUnfilledRow and sets isFull to
        // true if no more unfilled rows
        if(this.lastUnfilledRow >= 0){
            this.lastUnfilledRow -= 1;
        }
        if(this.lastUnfilledRow < 0){
            this.isFull = true;
        }
    }

}

