var dep1 = require('dep1'),
    dep2 = require('dep2');

module.exports = function(){
  console.log([dep1, dep2]);
};