// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract AceDen {

    IPyth pyth;
    bytes32 ethPriceFeedId = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace; // ETH/USD
    int public latestEthPrice;

    // Enum to represent prediction types: Bullish or Bearish
    enum Prediction { Bullish, Bearish }

    // Struct to store details of each bet
    struct Bet {
        address creator;          // Bet creator
        address opponent;         // Opponent who joined the bet
        uint256 amount;           // Amount of ETH wagered by each participant
        uint256 targetPrice;      // Target price for the bet to be evaluated against
        uint256 endTime;          // End time of the bet
        Prediction creatorPrediction; // Creator's prediction
        bool isSettled;           
        bool isDraw;             
        bool creatorWins;         
        bool rewardClaimed;     
    }

    mapping(uint256 => Bet) public bets; // Mapping to store bets by ID
    uint256 public betCount; // Bets counter

    constructor(address _pythContract) {
        pyth = IPyth(_pythContract);
    }

    // Function to create a new bet
    function createBet(
        uint256 _targetPrice,
        uint256 _duration,
        Prediction _prediction
    ) external payable {
        require(msg.value > 0, "Bet amount must be greater than 0");

        // Calculate the end time of the bet
        uint256 endTime = block.timestamp + _duration;

        // Store the new bet details in the mapping
        bets[betCount] = Bet({
            creator: msg.sender,
            opponent: address(0),
            amount: msg.value,
            targetPrice: _targetPrice,
            endTime: endTime,
            creatorPrediction: _prediction,
            isSettled: false,
            isDraw: false,
            creatorWins: false,
            rewardClaimed: false
        });

        // Increment the bet count
        betCount++;
    }

    // Function to join an existing bet
    function joinBet(uint256 _betId) external payable {
        Bet storage bet = bets[_betId];
        require(bet.creator != address(0), "Bet does not exist");
        require(bet.opponent == address(0), "Bet already joined");
        require(msg.value == bet.amount, "Bet amount must match");
        require(block.timestamp < bet.endTime, "Betting time has ended");

        bet.opponent = msg.sender;
    }

    // Function for the creator to cancel their bet if no one has joined
    function cancelBet(uint256 _betId) external {
        Bet storage bet = bets[_betId];
        require(bet.creator == msg.sender, "Only the creator can cancel");
        require(bet.opponent == address(0), "Bet already joined");

        // Refund the creator's bet amount
        uint256 refundAmount = bet.amount;
        delete bets[_betId];

        payable(msg.sender).transfer(refundAmount);
    }

    // Function to settle the bet after the betting period has ended
    function settleBet(uint256 _betId) external {
        Bet storage bet = bets[_betId];
        require(bet.creator != address(0), "Bet does not exist");
        require(bet.opponent != address(0), "Bet has no opponent");
        require(block.timestamp >= bet.endTime, "Betting period not ended");
        require(!bet.isSettled, "Bet already settled");


        if (latestEthPrice == int256(bet.targetPrice)) {
            bet.isDraw = true;
        } else if (bet.creatorPrediction == Prediction.Bullish) {
            bet.creatorWins = latestEthPrice > int256(bet.targetPrice); // Bullish: creator wins if latestEthPrice > target
        } else if (bet.creatorPrediction == Prediction.Bearish) {
            bet.creatorWins = latestEthPrice < int256(bet.targetPrice); // Bearish: creator wins if latestEthPrice < target
        }

        bet.isSettled = true;
    }

    // Function for participants to claim their reward
    function claimReward(uint256 _betId) external {
        Bet storage bet = bets[_betId];
        require(bet.isSettled, "Bet not yet settled");
        require(!bet.rewardClaimed, "Reward already claimed");
        
        if (bet.isDraw) {
            require(msg.sender == bet.creator || msg.sender == bet.opponent, "Not a participant");
            if (msg.sender == bet.creator) {
                payable(bet.creator).transfer(bet.amount);
            }
            if (msg.sender == bet.opponent) {
                payable(bet.opponent).transfer(bet.amount);
            }
        } else if (bet.creatorWins && msg.sender == bet.creator) {
            payable(bet.creator).transfer(bet.amount * 2);
        } else if (!bet.creatorWins && msg.sender == bet.opponent) {
            payable(bet.opponent).transfer(bet.amount * 2);
        } else {
            revert("You are not entitled to claim the reward");
        }
        
        bet.rewardClaimed = true;
    }

    function updateLatestPrice(bytes[] calldata priceUpdate) public payable {
        uint fee = pyth.getUpdateFee(priceUpdate);
        pyth.updatePriceFeeds{ value: fee }(priceUpdate);

        PythStructs.Price memory price = pyth.getPrice(ethPriceFeedId);

        latestEthPrice = price.price;
    }
}