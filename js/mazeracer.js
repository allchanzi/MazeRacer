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
const cellSize = 40;
const cols  = Math.floor(renderer.height / cellSize);
const rows = Math.floor(renderer.width / cellSize);

const grid = new Grid(rows, cols);
const toFromMapping = new Map([['N', 'S'], ['S', 'N'], ['W', 'E'], ['E', 'W']]);


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

function RecursiveBacktracker(grid){
    this.grid = grid;
    this.visitedStack = [];
    this.currentCell = this.grid.getCell(0, 0);

    this.possibleLocations = () => {
        let possibilities = [];
        this.currentCell.neighbors.forEach((value, key) => {
            if (value) {
                    possibilities.push(key);
            }
        });
        return possibilities
    };

    this.addToVisited = () => this.visitedStack.push(this.currentCell);

    this.getLastVisited = () => this.visitedStack.pop();

    this.getRandomNeighbor = () => this.possibleLocations()[getRandomIndex(this.possibleLocations())];

    this.updateNeighbors = () => {
        this.currentCell.neighbors.forEach((value, key) => {
            if (value) {
                if (this.grid.getCellId(value).visited){
                    this.currentCell.neighbors.set(key, false);
                }
            }
        });
    };

    this.visitNeighbor = (location) => {
        let neighbor = this.grid.getCellId(this.currentCell.neighbors.get(location));
        this.grid.removeWall(this.currentCell, location);
        this.currentCell = neighbor;
    };

    this.start = () => {
        this.currentCell.visited = true;
        this.updateNeighbors();
        if (this.currentCell.hasUnvisitedNeightbor()) {
            let rndLoc = this.getRandomNeighbor();
            this.visitNeighbor(rndLoc);
            this.addToVisited();
            this.start();
        } else {
            this.currentCell = this.getLastVisited();
            if (this.currentCell !== undefined){
                this.start();
            }
        }

    };
}

function Grid(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.grid = [];

    this.initNeighbors = (cell) => {
        cell.neighbors = new Map([['N', this.getIndex(cell.row - 1, cell.col)],
                                  ['S', this.getIndex(cell.row + 1, cell.col)],
                                  ['W', this.getIndex(cell.row,     cell.col - 1)],
                                  ['E', this.getIndex(cell.row,     cell.col + 1)]]);
    };

    this.initGrid = () => {
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                let cell = new Cell(i,j, cellSize);
                this.initNeighbors(cell);
                this.grid.push(cell)
            }
        }
    };

    this.drawGrid = () => {
        for(let i = 0; i < this.grid.length; i++){
            this.grid[i].drawWalls();
            //this.grid[i].printNeighbors();
        }
    };

    this.removeWall = (cell, orientation) => {
        cell.walls.set(orientation, false);
        let neighbor = cell.neighbors.get(orientation);
        neighbor ? this.grid[neighbor].walls.set(toFromMapping.get(orientation), false) : false;
    };

    this.getIndex = (i, j) => (i < 0 || i >= this.rows || j < 0 || j >= this.cols) ? false : j + i * this.cols;

    this.getCell = (i, j) => this.grid[this.getIndex(i, j)];

    this.getCellId = (id) => this.grid[id];


    this.initGrid();
}

function Cell(row,col, cellSize){
    this.row = row;
    this.col = col;
    this.cellSize = cellSize;
    this.walls = new Map([['N', true], ['S', true], ['W', true], ['E', true]]);
    this.neighbors = null;
    this.visited = false;

    this.hasUnvisitedNeightbor = () => {
        let hasNeighbor = false;
        for (let [key, value] of this.neighbors){
            if (value){
                hasNeighbor = true;
            }
        }
        return hasNeighbor
    };

    this.drawWalls = () => {
        this.walls.forEach((value, key) => {
            if (value) {
                switch (key) {
                    case ('N') :
                        drawLine(this.col * this.cellSize, this.row * this.cellSize, this.cellSize, 90);
                        break;
                    case ('S') :
                        drawLine(this.col * this.cellSize, this.row * this.cellSize + this.cellSize, this.cellSize, 90);
                        break;
                    case ('E') :
                        drawLine(this.col * this.cellSize + this.cellSize, this.row * this.cellSize, this.cellSize, 180);
                        break;
                    case ('W') :
                        drawLine(this.col * this.cellSize, this.row * this.cellSize, this.cellSize, 180);
                        break;
                }
            }
        });
    };

    this.drawCurrentCell = () => {
        drawRectangle(this.row * this.cellSize, this.col * this.cellSize, this.cellSize);
        this.drawWalls();
    };

    this.printNeighbors = () => {
        this.neighbors.forEach((value, key) => {
            console.log(this.row, this.col, key, value);
        })
    };
    }

function setup() {
    alg = new RecursiveBacktracker(grid);
    alg.start();
    grid.drawGrid();
    renderer.render(stage);
};

