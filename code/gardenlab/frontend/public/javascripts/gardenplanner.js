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
  
document.addEventListener('DOMContentLoaded', () => {
    fetchGardenAndRender();
});

function fetchGardenAndRender() {
    fetch('/virtualgarden/userGarden', { credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch garden');
            }
            return response.json();
        })
        .then(gardenData => {
            renderGarden(gardenData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



  function createGardenGrid(width, height) {
    const gardenGrid = document.getElementById('gardenGrid');
    gardenGrid.innerHTML = ''; // Clear the grid first
    gardenGrid.style.gridTemplateColumns = `repeat(${width}, 50px)`;
    gardenGrid.style.gridTemplateRows = `repeat(${height}, 50px)`;
  
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.addEventListener('dragover', allowDrop);
        cell.addEventListener('drop', drop);
        gardenGrid.appendChild(cell);
      }
    }
  }
  
  function renderGarden(gardenData) {
    const gardenGrid = document.getElementById('gardenGrid');
    gardenGrid.innerHTML = ''; // Clear the existing grid first

    // Set up the grid based on gardenData.width and gardenData.height
    gardenGrid.style.gridTemplateColumns = `repeat(${gardenData.width}, 50px)`;
    gardenGrid.style.gridTemplateRows = `repeat(${gardenData.height}, 50px)`;

    // Populate the grid with plants from gardenData.layout
    gardenData.layout.forEach(item => {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.style.gridColumnStart = item.position.x + 1; 
        cell.style.gridRowStart = item.position.y + 1;

        const plant = document.createElement('img');
        plant.src = `../images/${item.plantId}.webp`; 
        plant.className = 'plant';
        plant.draggable = false; 

        cell.appendChild(plant);
        gardenGrid.appendChild(cell);
    });
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

    clone.id = "clone_" + Date.now();
    clone.setAttribute('original-id', originalPlant.id); //storing og id instead of clone id

    if (ev.target.className.includes('grid-cell') && !ev.target.firstChild) {
        clone.style.width = '100%';
        clone.style.height = '100%';
        ev.target.appendChild(clone);
        ev.target.classList.add('occupied');
        document.getElementById('saveGarden').disabled = false;
    }
}


  
  function collectGardenData() {
    const cells = document.querySelectorAll('.grid-cell');
    const layout = Array.from(cells).map(cell => {
        const plant = cell.querySelector('.plant');
        // Use 'original-id' if present, otherwise fall back to the plant's own ID
        const plantId = plant ? (plant.getAttribute('original-id') || plant.id) : null;
        if (plant && plantId.startsWith("clone_")) {
            // If plantId still starts with "clone_", it means the original ID wasn't correctly assigned/found
            console.error("Original ID not found for:", plantId);
            return null; // Skip the plant
        }
        return plantId ? {
            plantId: plantId, // Use the corrected plant ID
            position: {
                x: parseInt(cell.dataset.x, 10),
                y: parseInt(cell.dataset.y, 10)
            }
        } : null;
    }).filter(item => item !== null); // Remove cells without plants or with incorrect IDs

    return {
        width: parseInt(document.getElementById('width').value, 10),
        height: parseInt(document.getElementById('height').value, 10),
        layout: layout
    };
}
 

  
  
  function saveGarden(gardenData) {
    //AJAX request
    fetch('/virtualgarden', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gardenData),
        credentials: 'include', // Necessary for cookies when using sessions
    })
    .then(response => { // Handle the response
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to save garden');
        }
    })
    .then(data => { // Handle the JSON data
        console.log('Success:', data);
        alert('Garden saved successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error saving garden. Please try again.');
    });
}



const saveGardenButton = document.getElementById('saveGarden');
if (saveGardenButton) {
    saveGardenButton.addEventListener('click', function() {
        const gardenData = collectGardenData();
        saveGarden(gardenData);
    });
} else {
    console.error('The saveGarden button was not found.');
}
  