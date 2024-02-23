if (typeof TextEncoder === "undefined") {
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
}


const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!DOCTYPE html><html><body><div id="gardenGrid"></div></body></html>');
const { window } = jsdom;
global.document = window.document;

// Assuming createGardenGrid is correctly exported from your module
const { createGardenGrid } = require('../../frontend/public/javascripts/gardenplanner');

describe('createGardenGrid', function() {
  it('should create a garden grid with the correct dimensions', function() {
    const width = 4;
    const height = 3;
    createGardenGrid(width, height);

    const gardenGrid = document.getElementById('gardenGrid');
    expect(gardenGrid).toBeDefined();
    expect(gardenGrid.style.gridTemplateColumns).toBe(`repeat(${width}, 50px)`);
    expect(gardenGrid.style.gridTemplateRows).toBe(`repeat(${height}, 50px)`);
    // Depending on how createGardenGrid works, you may want to check for the existence of child elements here
  });
});


// if (typeof TextEncoder === "undefined") {
//   global.TextEncoder = require("util").TextEncoder;
//   global.TextDecoder = require("util").TextDecoder;
// }


// const { JSDOM } = require('jsdom');

// const { createGardenGrid } = require('../../frontend/public/javascripts/gardenplanner');

// describe('createGardenGrid', function() {
//   let dom;
//   let document;

//   beforeEach(() => {
//     dom = new JSDOM('<!DOCTYPE html><div id="gardenGrid"></div>');
//     document = dom.window.document;
//     global.document = document;
//   });

//   it('should create a garden grid with the correct dimensions', function() {
//     const width = 4;
//     const height = 3;
//     createGardenGrid(width, height);

//     const gardenGrid = document.getElementById('gardenGrid');
//     // Use Jest's built-in expect for assertions
//     expect(gardenGrid).not.toBeNull();
//     expect(gardenGrid.childElementCount).toBe(width * height);
    
//   });

//   // afterEach or other hooks if needed
// });


//import { createGardenGrid } from '../../frontend/public/javascripts/gardenplanner';

// // Write your test
// describe('createGardenGrid', () => {
//   test('it should create a grid of the correct size', () => {
//     const width = 4;
//     const height = 3;
//     const result = createGardenGrid(width, height);
//     // Assuming createGardenGrid returns an array or an object you can inspect
//     expect(result).toHaveLength(height); // Just an example assertion
//   });
// });

// 

