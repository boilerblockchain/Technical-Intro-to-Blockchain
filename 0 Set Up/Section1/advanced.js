

/**
 * Async Javascript
 * Promises are used to handle asynchronous operations in Javascript.
 * 
 * async, makes a function return a Promise.
 * await, makes a function wait for a Promise.
 * 
 * 
*/
function resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 2000);
    });
}
  
async function asyncCall() {
    console.log('calling');
    const result = await resolveAfter2Seconds();
    console.log(result);
    // expected output: "resolved"
}
  
asyncCall();

/**
 * JSON (Java Script Object Notation)
 * JSON, is a lightwaight data-interchange format, it is easy for humans to read and write, and easy for machines 
 * to parse and generate.
 * 
 * JSON is built on two structures
 * - A collection of name/value pairs. (eg. object, struct, dictionary, hash table, keyed list, or associative array)
 * - An ordered list of values. (eg. array, vector, list, or sequence)
 * 
 * JSON.parse(text[, reviver]): parses a JSON string, constructing the JavaScript value or object described by the string.
 * JSON.stringify(value[, replacer[, space]]): converts a JavaScript value to a JSON string, optionally replacing values 
 * if a replacer function is specified, or optionally including only the specified properties if a replacer array is specified.
 * 
*/

// Converting a JSON string to a JavaScript object
// json object
const myJsonData = '{ "name": "John", "age": 22 }';

// converting to JavaScript object
const myObject = JSON.parse(myJsonData);

// accessing the data
console.log(myObject.name); // John

// Converting back to JSON
// JavaScript object
const myOtherJsonData = { "name": "John", "age": 22 };

// converting to JSON
const myObj = JSON.stringify(myOtherJsonData);

// accessing the data
console.log(myObj); // "{"name":"John","age":22}"


/** 
 * APIs using Fetch 
 * AIS (Application Programming Interfaces) are used to access data from applications and services.
 * 
 * Fetch can be used to make HTTP requests to external resources.
 * 
*/

const url = '';

// Call `fetch()`, passing in the URL.
fetch(url)
  // fetch() returns a promise. When we have received a response from the server,
  // the promise's `then()` handler is called with the response.
  .then((response) => {
    // Our handler throws an error if the request did not succeed.
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    // Otherwise (if the response succeeded), our handler fetches the response
    // as text by calling response.text(), and immediately returns the promise
    // returned by `response.text()`.
    return response.text();
  })
  // When response.text() has succeeded, the `then()` handler is called with
  // the text, and we copy it into the `poemDisplay` box.
  .then((text) => poemDisplay.textContent = text)
  // Catch any errors that might happen, and display a message
  // in the `poemDisplay` box.
  .catch((error) => poemDisplay.textContent = `Could not fetch verse: ${error}`);


/** 
 * Error Handling
 * 'throw' is used to throw an exception.
 * 
 * try...catch is used to handle exceptions.
 */
function getMonthName(mo) {
    mo--; // Adjust month number for array index (1 = Jan, 12 = Dec)
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    if (months[mo]) {
      return months[mo];
    } else {
      throw new Error('InvalidMonthNo'); // throw keyword is used here
    }
  }
  
  try { // statements to try
    monthName = getMonthName(myMonth); // function could throw exception
  } catch (e) {
    monthName = 'unknown';
    logMyErrors(e); // pass exception object to error handler (i.e. your own function)
}
  


/**
 * Unit Testing
 * 
 * describe(), calls a function that contains a test suite.
 * it() calls a function that contains a test.
 * expect() calls a function that contains an assertion.
 * 
 * toBe(), checks if a value is what you expect.
 * toEqual(), checks if two objects have the same values.
 * toBeGreaterThan(), checks if a value is greater than another value.
 * toBeLessThan(), checks if a value is less than another value.
 * toBeDefined(), checks if a variable is defined.
 * toBeUndefined(), checks if a variable is undefined.
 * toBeNull(), checks if a variable is null.
 * toBeTruthy(), checks if a variable is true.
 * toBeFalsy(), checks if a variable is false.
 * toContain(), checks if an array contains a particular item.
 * toThrow(), checks if a function throws an error when it is called.
 * 
 * 
*/
describe('Jasmine Matchers', () => {
    it('should have a working expect function', () => {
        expect(true).toBe(true);
    });
    it('should have a working toBe function', () => {
        expect(true).toBe(true);
    });
    it('should have a working toEqual function', () => {
        expect({a: 1}).toEqual({a: 1});
    });
    it('should have a working toBeGreaterThan function', () => {
        expect(2).toBeGreaterThan(1);
    });
    it('should have a working toBeLessThan function', () => {
        expect(1).toBeLessThan(2);
    });
    it('should have a working toBeDefined function', () => {
        expect({}).toBeDefined();
    });
    it('should have a working toBeUndefined function', () => {
        expect(undefined).toBeUndefined();
    });
    it('should have a working toBeNull function', () => {
        expect(null).toBeNull();
    });
    it('should have a working toBeTruthy function', () => {
        expect(true).toBeTruthy();
    });
    it('should have a working toBeFalsy function', () => {
        expect(false).toBeFalsy();
    });
    it('should have a working toContain function', () => {
        expect([1, 2, 3]).toContain(2);
    });
    it('should have a working toThrow function', () => {
        expect(() => {
            throw new Error('error');
        }).toThrow();
    });
});
