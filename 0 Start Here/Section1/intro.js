/**
 * Multi-line comments
 * Comments are important for understanding the code. You will be working in teams through the course, so please use them!
 */

//Single line comments

/Variables, Constants/
/**
 * Declaring a variable
 * "var": declare global variables, available in the entire program.
 * "let": declare local variables, available only in the scope of the block.
 * "const": declare constants, available only in the scope of the block.
 * 
 * Casing! We use lowerCamelCase for variables and upperCamelCase for constants in Javascript.
 * 
 * Printing! We use console.log to print to the console.
 * 
 * Null! We use null to represent a value that is not yet defined.
 * Undefined! We use the constant undefined to represent a value that is not yet initialized
 */

var mySchool;

//"typeof" keyword
console.log(typeof(mySchool)); //Returns "undefined"

var mySchool = null;

//String
mySchool = "Purdue";
let myName = `John ${mySchool}`;

console.log(myName);

//Constant. Need to initialize it!
const PI = 3.14;

//Boolean
let isTrue = true;

//Number
console.log(3/2); //1.5 Integerst are implicitly floats!

parseInt('122'); //Converts a string to an integer.

//BigInt. Represent integers larger than Number.MAX_SAFE_INTEGER.
const numMaxSafe = BigInt(Number.MAX_SAFE_INTEGER); //9007199254740991n

const maxSafeMultiple = numMaxSafe * 2n; //18014398509481982n


/Objects/
/**
 * Objects are collections of key-value pairs.
 */
let successfulStudent = {
    name: "John",
    age: 21,
    hardworking: isTrue
}
console.log(successfulStudent.hardworking);

successfulStudent.hardworking = false; //Update the value of the property
console.log(successfulStudent.hardworking);

//Arrays
let myRandomNotes = [1, "Purdue", PI, isTrue];
console.log(myRandomNotes[2]); //Prints the value of PI


/Functions, Operators/
/**
 * Functions make code reusable, tale arguments or paramenters and return an output.
 * 
 * @param num1 - The first number to add.
 * @param num2 - The second number to add.
 * @param num3 - The third number to add.
 * @returns The sum of the three numbers. 
*/
function simpleCalculation(num1, num2, num3) {
    return num1 + num2 * num3;
}

//Operator precedence: * and / have higher precedence than + and -.
simpleCalculation(2, 3, 4); //Returns 14 not 10!


/**Math utilities in Javascript https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math#Methods
 * Here are some useful math functions:
 * 
 * Math.random() - Returns a random number between 0 and 1.
 * Math.floor(x) - Returns the largest integer less than or equal to x.
 * Math.round(x) - Returns the nearest integer to x.
 * Math.pow(x, y) - Returns the value of x to the power of y.
 * Math.PI - Returns the value of PI.
 */

function complexCalculation() {
    randNum = Math.random();
    //console.log(randNum); //This is the random number between 0 and 1.

    randNum = (Math.random()*80)+20; //This is the random number between 20 and 80.

    powerNum = Math.pow(Math.floor(6.05),Math.PI)

    return simpleCalculation(randNum, powerNum, Math.round(-10.55))
}

console.log(`The result of this calculation is ${complexCalculation()}`);


/Conditionals and Loops/
/**
 * do-while, for-in, for-of, if-else, switch
 * 
 * ||, &&, !, ==, ===, !=, !==, >, <, >=, <=, ?, :
 */



function veryComplexCalculation() {

}


/Classes and Interfaces/

/**
 * Classes
 * - Constructors are used to initialize the properties of an object.
 * - Properties are variables that belong to the class.
 * - Methods are functions that belong to the class.
 * 
 * "this" keyword: refers to the object that is currently being created.
 * "new" keyword: used to create a new instance of a class.
 * "static" keyword: static methods are methods that belong to the class but not to an instance of the class.
 */

//Instantiate a new object
class Student {
    education = "High School";

    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    static dropOut() {
        console.log("I don't like school!");
    }   

    study() {
        console.log(`${this.name} is studying.`);
    }
 
}

let john = new Student("John", 21);

//John.dropOut(); //This will throw an error because dropOut is a static method.
Student.dropOut();  
console.log(john.education);

/**
 * Inheritance
 * 
 * Encapsulation
 * 
 * "#", Private methods
 * "instanceof" keyword: checks if an object is an instance of a class.
 * 
 */
class PurdueStudent extends Student() {
    constructor(name, age, school) {
        super(name, age);
        this.school = school;
    }

    learnBlockchain() {
        console.log("I'm learning blockchain!");
    }
}

//PurdueStudent purduePete = new PurdueStudent("Pete", 21, "Purdue");

//purduePete instanceof Student; //Returns true, takes into account inheritance