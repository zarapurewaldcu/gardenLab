document.addEventListener('DOMContentLoaded', () => {
    // Render the default grid size of 3x4 on page load
    createGardenGrid(4, 3);
  
    // Update grid when the button is clicked
    document.getElementById('updateGrid').addEventListener('click', function() {
      const width = parseInt(document.getElementById('width').value, 10);
      const height = parseInt(document.getElementById('height').value, 10);
      createGardenGrid(width, height);
    });
  
    // Initialize drag functionality for plants
    initializeDraggablePlants();
  });
  
  function createGardenGrid(width, height) {
    const gardenGrid = document.getElementById('gardenGrid');
    gardenGrid.innerHTML = ''; // Clear the grid first
    gardenGrid.style.gridTemplateColumns = `repeat(${width}, 50px)`;
    gardenGrid.style.gridTemplateRows = `repeat(${height}, 50px)`;
  
    for (let i = 0; i < width * height; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.index = i; // Assign an index to each cell for identification
      cell.addEventListener('dragover', allowDrop);
      cell.addEventListener('drop', drop);
      gardenGrid.appendChild(cell);
    }
  }
  
  function initializeDraggablePlants() {
    const plants = document.querySelectorAll('.plant');
    plants.forEach(plant => {
      plant.setAttribute('draggable', true);
      plant.addEventListener('dragstart', dragStart);
    });
  }
  
  function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
  }
  
  function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const originalPlant = document.getElementById(data);
    const clone = originalPlant.cloneNode(true);
  
    // Give the clone a new unique ID
    clone.id = "clone_" + Date.now();
  
    if (ev.target.className.includes('grid-cell') && !ev.target.firstChild) {
      // Fit the clone inside the grid cell
      clone.style.width = '100%';
      clone.style.height = '100%';
      ev.target.appendChild(clone);
      ev.target.classList.add('occupied');
      document.getElementById('saveGarden').disabled = false;
    }
  }
  
  
  function collectGardenData() {
    // Collect the garden state data for saving
    const cells = document.querySelectorAll('.grid-cell');
    const gardenState = Array.from(cells).map(cell => {
      return cell.firstChild ? cell.firstChild.className : null;
    });
    
    return {
      width: parseInt(document.getElementById('width').value, 10),
      height: parseInt(document.getElementById('height').value, 10),
      plants: gardenState
    };
  }
  
  function saveGarden(gardenData) {
    // Implement the AJAX request to send gardenData to the server
    console.log('Saving garden data:', gardenData);
    // Add fetch request here
  }
  