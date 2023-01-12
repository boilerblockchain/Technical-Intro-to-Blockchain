## Challenge: Smart Contracts II

## Part 1: Delegatecall Vulnerability

This Todo contract has an example of a delegatecall() vulnerability. 
Any address could execute addTask() without permission.

```Solidity
pragma solidity ^0.8.0;

contract Todo {
    address public owner;
    mapping(address => bool) public tasksCompleted;

    constructor() public {
        owner = msg.sender;
    }

    function addTask(string memory _task) public {
        // TODO: Fix delegatecall vulnerability
        address payable delegate = msg.sender;
        delegate.delegatecall(abi.encodeWithSignature("addTask(string)", _task));
    }

    function markTaskComplete(address _user) public {
        require(msg.sender == owner, "Only the owner can mark tasks as complete.");
        tasksCompleted[_user] = true;
    }

    function isTaskComplete(address _user) public view returns (bool) {
        return tasksCompleted[_user];
    }
}
```

The vulnerability can be fixed by requiring a certain address to be the message sender.

```Solidity
function addTask(string memory _task) public {
    require(msg.sender == owner, "Only the owner can add task");
    // add the task to the task list
}
```

### TODO: 
Write a "MultipleCall" contract that allows a function to make multiple delegatecalls to a given set of addresses.
Bonus: require addresses to sign a transaction to be verified.

---

## Part 2: Uniswap V3 Arbitrage using Flash Swaps

## TODO:
Write a set of smart contracts that makes swaps based on arbitrage:

**FlashSwapArbitrage**
Coordinates arbitrage, contains logic for determining best opportunities and calls the FlashSwap contract to execute trades.
Keeps track of parameters such as *minimum required profit threshold*.

**FlashSwap**
Executes the flash swaps on the Uniswap V3 smart contract. Handles any necessary token approvals.

**PriceOracle**
Query current prices using oracles and share them wih FlashSwapArbitrage.

**Allowance**
Token approvals for FlashSwap to execute trades.
Keeps trading limits on user tokens.

You have freedom to implement any version of this as you like.
The working of the app could be something along these lines:
- The arbitrage contract monitors Uniswap V3 prices through the oracles to find a profitable opportunity
- If an opportunity is found, the flash swap contract trades with the tokes from the allowance contract
- Arbitrade contract keeps updating its state

Reference class materials for information on Uniswap V3, constant product AMMs, and Chainlink oracles.
