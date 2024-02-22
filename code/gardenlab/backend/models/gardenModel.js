// // Minizinc related code in this file from https://www.npmjs.com/package/minizinc 

const MiniZinc = require('minizinc');

MiniZinc.init({
	minizinc: 'minizinc',
	//minizincPaths: ['/usr/bin/'] //node requires an existing installation of minizinc
  });

  const gardenModel = new MiniZinc.Model();
  gardenModel.addFile('../minizinc/test.mzn');

module.exports = gardenModel;

