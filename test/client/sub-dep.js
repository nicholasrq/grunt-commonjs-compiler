var lib = require('lib/lib');

module.exports = function(){
  return 'sub dependency, uses:' + lib();
};