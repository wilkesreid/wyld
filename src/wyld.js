(function() {
  function Map(map) {

    // Pattern for getting tokens out of a condition
    var pattern = /^(<|>|<=|>=)(-?[0-9]+)(?:\&(<|>|<=|>=)(-?[0-9]+))?|(-?[0-9]+)(<|>|<=|>=)\$(<|>|<=|>=)(-?[0-9]+)$/;

    /*
    Check if string contains one or more conditions.
    */
    function hasCondition(str) {
      if (pattern.test(str)) {
        return true;
      }
    }

    /*
    Compare input with output given a string comparator
    */
    function compare(a, cmp, b) {
      switch (cmp) {
        case '>': return a > b; break;
        case '<': return a < b; break;
        case '>=': return a >= b; break;
        case '<=': return a <= b; break;
        default: return false;
      }
    }

    /*
    When given a string that possibly contains
    one or more conditions, evaluate them.
    */
    function evaluateCondition(input, str, output) {
      // Check for universal match
      if (str === '*') {
        return output;
      }

      var tokens = str.match(pattern);

      // Check if there is a condition at all
      if (tokens === null) {
        // There is no condition
        return null;
      }

      // There is at least one condition

      // Check if this is a dollar sign condition
      if (tokens[5] !== undefined) {
        // This is a dollar sign condition
        if (compare(parseInt(tokens[5]), tokens[6], input) && compare(input, tokens[7], parseInt(tokens[8]))) {
          return output;
        } else {
          return null;
        }
      } else {
        // This is not a dollar sign condition

        // Check if this is two conditions separated by an '&'
        if (tokens[3] !== undefined) {
          // This is two conditions separated by an '&'
          if (compare(input, tokens[1], parseInt(tokens[2])) && compare(input, tokens[3], parseInt(tokens[4]))) {
            return output;
          } else {
            return null;
          }
        } else {
          // There is only one condition
          if (compare(input, tokens[1], parseInt(tokens[2]))) {
            return output;
          } else {
            return null;
          }
        }
      }
    }

    /*
    Retrieve output based on input
    */
  	function get(num) {
    	var result = num;

      // Loop through keys and evaluate any conditions found
      for (var key in map) {
        condition_result = evaluateCondition(parseInt(num), key, map[key]);

        // If the result is not null, then the key was a condition that evaluated to true
        if (condition_result !== null) {
          result = condition_result;
        }

      }
      // Override with last found direct mapping
    	if (map.hasOwnProperty(num)) {
      	result = map[num];
      }
      // Do callback if result is a function
      if (result instanceof Function) {
      	result = result(parseInt(num));
      }

      return result;
    }

    /*
    Return public functions
    */
    return {
    	get: get
    };
  }

  /*
  Create global Wyld object
  */
  window.Wyld = {
    Map: Map
  };
})();
