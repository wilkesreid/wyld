# Wyld

Wyld is a lightweight Javascript library that allows you to easily create input-output mappings.

This library is named after [James Wyld](https://en.wikipedia.org/wiki/James_Wyld).

# Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Types of Mappings](#types-of-mappings)
  - [Direct](#direct)
  - [Conditional](#conditional)
  - [Calculated](#calculated)
  - [Universal](#universal)
- [Collisions](#collisions)
- [The Future](#the-future)


## Installation

~~You can use any of the following Javascript package managers to install Wyld.~~

~~`npm install wyld`~~

~~`bower install wyld`~~

~~`yarn add wyld`~~

Hopefully this tool will be available via all these package managers soon. In the mean time, you can manually download `wyld.js` directly from Github.

## Usage

Use `Wyld.Map` in conjunction with a configuration object to create your map.

```
var map = Wyld.Map({
  // map configuration goes here
});
```

When you want to retrieve an output for a given input using the map, call the `get` method.

```
var output = map.get(input);
```

## Types of Mappings

### Direct

To create a direct mapping from an exact input to an exact output, use a key-value assignment.

```
var map = Wyld.Map({
  5: 10
});
map.get(5); // returns 10
```

Duplicate input keys will result in the last one being used.

```
var map = Wyld.Map({
  5: 10,
  5: 50
});
map.get(5); // returns 5
```

### Conditional

To map multiple inputs to a single output based on
whether or not the input satisfies a condition,
use keys in quotes and include the relevant operator.

```
var map = Wyld.Map({
  '>10': 10,
  '<5': 5
});
map.get(50); // returns 10
map.get(2); // returns 5
```

The conditions supported are greater than `>`, less than `<`, greater than or equal to `>=`, and less than or equal to `<=`.

There ~~are two ways~~ is only one currently implemented way to evaluate multiple conditions at once. Use a single `&` operator to separate conditions.

```
var map = Wyld.Map({
  '>5&<10': 20,
});
map.get(7); // returns 20
```

An easier to read way would be to put a dollar sign `$` in the key to represent the input and surround it with the conditions. This will be implemented soon.

```
var map = Wyld.Map({
  '5<$<10': 20, // not yet implemented
});
map.get(7); // returns 20
```

The string `5<$<10` reads `if the input is greater than five and less than 10`.

### Calculated

To have an output be a calculated operation on the input, just map to a callback function.

```
var map = Wyld.Map({
  '>5': function(num){
    return num/2;
  }
});
map.get(5); // returns 5
map.get(6); // returns 3
map.get(20); // returns 10
```

### Universal

Using a quote-surrounded `*` as a key will act as a universal mapping. If it is the only rule in the map, then all inputs will map to its output. If there are other rules in the map, then placing it at the beginning will act as a default in the case that no other mappings match, and placing it at the end will override all other rules.

```
var map = Wyld.Map({
  '*': 10,
  5: 15
});
map.get(5); // returns 15
map.get(-50); // returns 10
map.get(22); // returns 10
```

## Collisions

It is possible to create a map with incompatible or overlapping rules.

```
var map = Wyld.Map({
  '>5': 10,
  '<10': 1,

  '>20': 100,
  '>50': 500
});
map.get(7); // returns 1
map.get(70); // returns 500
```

When rules conflict or overlap, the last one declared that matches the given input overrides all previous rules.

## The Future

This tool is in its infancy and welcomes advice, suggestions, and contributions. If you have any ideas for how to make it better, don't hesitate to submit a feature request!
