include "alldifferent.mzn";
enum plants;
% enum soilType;
% enum plantType;
% enum shadeType;
% enum season;
% enum pStats;
% enum gStats;

int: limit;
int: gardenSoilType;
int: gardenShadeType;

enum pStats = {plantType, soilType, shadeType, watering, season}; %What each column represents on statsPerPlant
% enum gStats = {gardenSoilType, gardenShadeType}; %What each column represents on statsPerPlot

array[plants, pStats] of int: statsPerPlant; 
% array[1..limit, gStats] of int: statsPerPlot;


array[1..limit] of var plants: chosenPlants; % Final list of the plant that were chosen 

% plantType = {Fruit, Vegetable, Tree, Herb};
% soilType = {Normal, Clay, Dry};
% shadeType = {fullShade, halfShade, fullSun};
% watering = {Rare, Occasional, SemiFrequent, Frequent, Often};
% season = {Spring, Summer, Autumn, Winter};





% Constraints
% constraint forall(i in 1..limit)(
%     plantStats[chosenPlants[i], soilType] = gardenStats[i, soilType]/\
%     plantStats[chosenPlants[i], shadeType] = gardenStats[i, shadeType]
% );
constraint alldifferent(chosenPlants);
constraint forall(i in 1..limit)(
    statsPerPlant[chosenPlants[i], soilType] == gardenSoilType /\
    statsPerPlant[chosenPlants[i], shadeType] == gardenShadeType
);

% Solve statement
solve satisfy;

% Output
% output ["Chosen plants: "];
% output [plantNames[chosenPlants[i]] ++ " " | i in 1..limit];
