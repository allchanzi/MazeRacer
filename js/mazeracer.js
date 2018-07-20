/*
    i,j => row, col
 */

//Create application (renderer)
const renderer = new PIXI.autoDetectRenderer(800,800, {backgroundColor: 0x005c99});
//Append canvas to body
document.body.appendChild(renderer.view);
//Scene holder
const stage = new PIXI.Container();
//Graphic object

//Maze variables
const cellSize = 80;
const cols  = Math.floor(renderer.height / cellSize);
const rows = Math.floor(renderer.width / cellSize);
const grid = [];

setup();

function drawLine(startX, startY, length, rotDeg){
    //Create new line
    let graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0xD5402B, 1);

// Define line position - this aligns the top left corner of an element
    graphics.position.x = startX;
    graphics.position.y = startY;
    graphics.pivot.set(0, length);
    graphics.rotation = grad2rad(rotDeg);
// Draw line
    graphics.moveTo(0,0);
    graphics.lineTo(0, length);
    stage.addChild(graphics);
}

function drawRectangle(startX, startY, length){
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0xFFFF00);
    graphics.lineStyle(0, 0xFF0000);
    graphics.drawRect(startX, startY, length, length);
    stage.addChild(graphics);
}

function drawGrid(){
    for(let i = 0; i < grid.length; i++){
        grid[i].drawWalls();
    }
}

function getIndex(i, j){
    return j + i * cols;
}

function RecursiveBacktracker(){
    this.current = grid[0];
    this.current.visited = true;

    this.getRandomOrientation = function (cell) {
        switch (cell){
            case (cell.row === 0) :
        }
    };

    this.visitRandomNeighbor = function (cell) {

    };

    this.start = function () {
        const randOrientation = this.directions[getRandomIndex(this.directions)];
        this.next = this.current.visitNeighbor(randOrientation);

    };


}

function Cell(row,col){
    const self = this;
    this.row = row;
    this.col = col;
    this.walls = new Map([['N', true], ['S', true], ['W', true], ['E', true]]);
    this.neighbors = new Map([['N', true], ['S', true], ['W', true], ['E', true]]);
    this.visited = false;

    this.initNeighbor = function() {
        this.row === 0 ? this.neighbors.set('N', false)
            : this.col ===0 ? this.neighbors.set('W', false)
            : this.row === rows ? this.neighbors.set('S', false)
            : this.col === cols ? this.neighbors.set('E', false)
            : void(0);
    };

    this.drawWalls = function() {
        this.walls.forEach(function (value, key){
            (value !== true) ? void(0)
                : (key === 'N' ) ? drawLine(self.row * cellSize, self.col * cellSize, cellSize, 90)
                : (key === "S") ? drawLine(self.row * cellSize, self.col * cellSize + cellSize, cellSize, 90)
                : (key === "E") ? drawLine(self.row * cellSize + cellSize, self.col * cellSize, cellSize, 180)
                : drawLine(self.row * cellSize, self.col * cellSize, cellSize, 0);
        });
    };

    this.checkNeighbors = function () {
        let condition = false;
        let iterator = this.neighbors.values();
        while (!condition && condition !== undefined) {
            condition = iterator.next().value;
        }
        return condition === undefined ? false : condition
    };

    this.drawCurrentCell = function() {
        drawRectangle(row * cellSize, col * cellSize,cellSize);
    };

    this.randomNeighbor = function () {

    };

    this.visitNeighbor = function (orientation) {
        if (this.neighbors.get(orientation) === true) {
            this.neighbors.set(orientation, false);
            this.walls.set(orientation, false);
            switch (orientation){
                case 'N': return getIndex(row - 1, col);
                case 'S': return getIndex(row + 1, col);
                case 'W': return getIndex(row, col + 1);
                case 'E': return getIndex(row, col - 1);
            }
        }
    };

    this.initNeighbor();
}

function initGrid(){
    for(let i = 0; i < rows; i++){
        for(j = 0; j < cols; j++){
            let cell = new Cell(i,j);
            grid.push(cell)
        }
    }
}

function setup(){
    initGrid();
    console.log(grid[0].checkNeighbors());
    //grid[0].checkNeighbors();
    //drawGrid();
    //drawRectangle(0,0,cellSize);
    renderer.render(stage);
}
