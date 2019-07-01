/**
 * Using p5.js to make all things happen, extending functions from that
 */

//number of available characters
const AVAILABLE_CHARACTERS = 96;
//the starting unicde character
const STARTING_UNICODE_CHARACTER = 0X30A0;

var symbolSize = 24;
var streams = [];

//overridden from p5.js
function setup() {

    //carve out canvas area - the whole browser area
    createCanvas(
        window.innerWidth,
        window.innerHeight
    );
    //make all black
    background(0);

    //get coords of stream
    var x = 0;

    //get number of streams based on screen size
    for (var i = 0; i <= width / symbolSize; i++) {
        //create Stream
        var stream = new Stream();
        var streamStartHeight = random(-1000, 0);
        stream.generateSymbols(x, streamStartHeight);
        //add to array
        streams.push(stream);
        //make stream beside
        x += symbolSize;
    }

    textSize(symbolSize);
}

//overriden from p5.js
function draw() {
    //call p5.js to render background
    background(0, 150);
    //render all streams
    streams.forEach(function (stream) {
        stream.render();
    });
}

//prototype for 'rain' symbol
function Symbol(x, y, speed, first) {
    this.x = x;
    this.y = y;
    this.value;
    this.speed = speed;
    this.switchInterval = round(random(2, 20));
    this.first = first;

    //create randomizer
    this.setToRandomSymbol = function () {

        //use p5 built in counter to determine when to generate symbol (reset at every end-frame)
        if (frameCount % this.switchInterval === 0) {
            //generate and set the symbol
            this.value = String.fromCharCode(
                STARTING_UNICODE_CHARACTER + round(random(0, AVAILABLE_CHARACTERS))
            );
        }
    };

    //make symbol rain down
    this.rain = function () {

        if (this.y >= height) {
            //at bottom of canvas - reset height
            this.y = 0
        }
        else {
            //make it rain - with speed
            this.y += this.speed;
        }
    };
}

//prototype for 'stream'
function Stream() {
    this.symbols = [];
    this.totalSymbols = round(random(5, 30));
    this.speed = random(4, 17);

    //create symbols
    this.generateSymbols = function (x, y) {
        var first = round(random(0, 4)) == 1;

        for (var i = 0; i <= this.totalSymbols; i++) {
            //create a Symbol
            var symbol = new Symbol(x, y, this.speed, first);
            symbol.setToRandomSymbol();
            //add to array
            this.symbols.push(symbol);
            //this will set next symbol above it
            y -= symbolSize;
            first = false;
        }
    }

    //show symbols
    this.render = function () {

        this.symbols.forEach(function (symbol) {

            //highlight if the symbol is first
            if (symbol.first) {
                fill(180, 255, 180);
            }
            else {
                fill(0, 255, 70);
            }

            text(symbol.value, symbol.x, symbol.y);
            symbol.rain();
            symbol.setToRandomSymbol();
        });
    };
}