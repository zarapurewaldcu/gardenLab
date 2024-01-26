enum plants;
enum soilType;
enum plantType;
enum shadeType;
enum season;
enum pStats;
enum gStats;

int: limit;

array[plants, pStats] of int: plantStats;


array[1..limit, gStats] of int: gardenStats;
array[1..limit] of var plants: chosenPlants;


% Create a mapping from enum values to strings
array[plants] of string: plantNames = ["Rose", "Tulip", "Daisy", "Orchid", "Lavender", "Sunflower", "Walnut", "Iris", "Basil", "Fern"];


% Constraints
constraint forall(i in 1..limit)(
    plantStats[chosenPlants[i], soilType] = gardenStats[i, soilType]/\
    plantStats[chosenPlants[i], shadeType] = gardenStats[i, shadeType]
);

% Solve statement
solve satisfy;

% Output
output ["Chosen plants: "] ++ [plantNames[chosenPlants[i]] ++ " " | i in 1..limit];
