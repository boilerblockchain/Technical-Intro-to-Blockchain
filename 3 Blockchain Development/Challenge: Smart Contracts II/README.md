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
    // continue.. add the task to the task list
}
```

### TODO: 
Write a "MultipleCall" contract that allows a function to make multiple delegatecalls to a given set of addresses.
Bonus: require addresses to sign a transaction to be verified.

---

## Part 2: Uniswap V3 Arbitrage using Flash Swaps

Reference class materials for information on Uniswap V3, constant product AMMs, and Chainlink oracles.
Uniswap Core Contracts: https://github.com/Uniswap/v3-core

### TODO:
Write a set of smart contracts that makes swaps based on arbitrage:

- **FlashSwapArbitrage**: Coordinates arbitrage, contains logic for determining best opportunities and calls the FlashSwap contract to execute trades. Keeps track of parameters such as *minimum required profit threshold*.

- **FlashSwap**: Executes the flash swaps on the Uniswap V3 smart contract. Handles any necessary token approvals.

- **PriceOracle**: Queries current prices using oracles and share them wih FlashSwapArbitrage.

- **Budget**: Token approvals for FlashSwap to execute trades. Keeps trading limits on user tokens.

You have freedom to implement any version of this as you like.
The working of the app could be something along these lines:
1 The arbitrage contract monitors Uniswap V3 prices through the oracles to find a profitable opportunity
2 If an opportunity is found, the flash swap contract trades with the tokes from the budget contract
3 Arbitrade contract keeps updating its state

### Sample TEST
This is what a sample Solidity test might look like:
Deploy contracts, chask if flash swap was executued correctly, then if trade was or not profitable and finally whether the tokens were correctly swapped.

```Solidity
pragma solidity ^0.8.0;
import "./FlashSwapArbitrage.sol";
import "./PriceOracle.sol";

contract TestFlashSwapArbitrage {
    FlashSwapArbitrage flashSwapArbitrage;
    PriceOracle priceOracle;

    constructor() public {
        flashSwapArbitrage = new FlashSwapArbitrage(address(this), address(priceOracle), 100);
    }

    function testSuccessfulFlashSwap() public {
        // set prices in price oracle
        priceOracle.updatePrice(address(tokenA), 100);
        priceOracle.updatePrice(address(tokenB), 50);

        // call arbitrage function
        flashSwapArbitrage.arbitrage();

        // check if the trade was executed
        bool tradeExecuted = flashSwapArbitrage.executed();
        require(tradeExecuted, "Flash swap was not executed");
        
        // check if the trade was profitable
        uint expectedProfit = flashSwapArbitrage.calculateProfit(tokenA, tokenB);
        require(expectedProfit > flashSwapArbitrage.minProfit(), "Flash swap was not profitable");

        // check if tokens were correctly swapped
        address tokenIn = flashSwapArbitrage.tokenIn();
        address tokenOut = flashSwapArbitrage.tokenOut();
        uint amount = flashSwapArbitrage.amount();
        uint tokenInBalance = ERC20(tokenIn).balanceOf(msg.sender);
        uint tokenOutBalance = ERC20(tokenOut).balanceOf(msg.sender);
        require(tokenInBalance == 0, "TokenIn was not correctly swapped");
        require(tokenOutBalance == amount, "TokenOut was not correctly swapped");
    }
}
```
