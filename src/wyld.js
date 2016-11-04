(function() {
  function Map(map) {

    /*
    Check if string contains one or more conditions.
    */
    function hasCondition(str) {
      if (str.indexOf("&") > -1) {
        return true;
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

      // Check for multiple conditions
      if (str.indexOf("&") == -1 ) {
        // There is only one condition

        // Get operator, if it exists
        var operator = str.match(/[><=]+/)

        // Check if we found an operator at all
        if (operator.length > 0) {
          operator = operator[0];
        } else {
          return null;
        }

        var value = parseInt(str.substring(operator.length));

        // Check condition based on operator
        switch(operator) {
          case '>':
            if (input > value) return output;
          break;
          case '<':
            if (input < value) return output;
          break;
          case '>=':
            if (input >= value) return output;
          break;
          case '<=':
            if (input <= value) return output;
          break;
        }

        // If we got to this point, then the condition failed
        return null;

      } else {
        // There are multiple conditions

        var conditions = str.split("&");

        // Assume all conditions are satisfied
        // until one is proven false
        var all_satisfied = true;

        // Loop through conditions in this string
        for (i=0;i<conditions.length;i++) {

          var rule = conditions[i];
          var operator = rule.match(/[><=]+/)[0];
          var value = parseInt(rule.substring(operator.length));

          // Check condition based on operator
          switch(operator) {
            case '>':
              if (input <= value) all_satisfied = false;
            break;
            case '<':
              if (input >= value) all_satisfied = false;
            break;
            case '>=':
              if (input < value) all_satisfied = false;
            break;
            case '<=':
              if (input > value) all_satisfied = false;
            break;
          }
        }

        // If all conditions in string were satisfied
        if (all_satisfied) {
          return output;
        } else {
          return null;
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
