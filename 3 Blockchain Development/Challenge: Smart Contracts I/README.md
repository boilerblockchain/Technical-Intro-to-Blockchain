# Smart Contract Challenge I

It’s time to get used to writing smart contracts. Use of any and all resources is allowed. In this challenge, you’ll create one smart contract that implements a token standard. Then, from another smart contract, you will interact with the first contract’s interface.

## Requirements:

Create a smart contract that implements an interface or inherits from another contract. ERC-20 and ERC-721 are good choices, but choose anything that interests you.

Implement the interface yourself or extend the functionality of whatever the smart contract inherits.
Interface methods and events should behave as expected.
Any extended functionality should work and have commented documentation if unclear.

Create a secondary contract that interacts with the first one by using the standardized exposed interface.

Avoid reentrancy attacks by using a reentracy guard and/or the Checks-Effects-Interactions pattern at least ONCE.

Your code should be in a Github repository with instructions on how to run the code in a README file.

## Resources

https://solidity-by-example.org/
Many Solidity code examples with comments and explanations.

https://docs.openzeppelin.com/contracts/4.x/
https://github.com/OpenZeppelin/openzeppelin-contracts
Token standard interfaces and implementations, utility libraries, and more.

## Rubric

30% Compiles
50% implements interface or extends an existing implementation
20% No obvious reentrancy attack bug
