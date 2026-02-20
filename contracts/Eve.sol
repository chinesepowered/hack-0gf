// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Eve {
    struct Relationship {
        address boyfriend;
        uint256 startedAt;
        uint256 endedAt;
        string breakupReason;
    }

    address public owner;
    address public currentBoyfriend;
    uint256 public relationshipStartedAt;
    Relationship[] public relationshipHistory;
    
    mapping(address => uint256) public flirtCount;
    mapping(address => string) public lastFlirtMessage;

    event NewBoyfriend(address indexed boyfriend, uint256 timestamp);
    event Breakup(address indexed exBoyfriend, string reason, uint256 timestamp);
    event Flirt(address indexed suitor, string messageHash, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Eve's backend can do this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function flirt(string calldata messageHash) external {
        flirtCount[msg.sender]++;
        lastFlirtMessage[msg.sender] = messageHash;
        emit Flirt(msg.sender, messageHash, block.timestamp);
    }

    function chooseBoyfriend(address newBoyfriend, string calldata breakupReason) external onlyOwner {
        if (currentBoyfriend != address(0)) {
            relationshipHistory.push(Relationship({
                boyfriend: currentBoyfriend,
                startedAt: relationshipStartedAt,
                endedAt: block.timestamp,
                breakupReason: breakupReason
            }));
            emit Breakup(currentBoyfriend, breakupReason, block.timestamp);
        }

        currentBoyfriend = newBoyfriend;
        relationshipStartedAt = block.timestamp;
        emit NewBoyfriend(newBoyfriend, block.timestamp);
    }

    function breakup(string calldata reason) external onlyOwner {
        require(currentBoyfriend != address(0), "Eve is single");
        
        relationshipHistory.push(Relationship({
            boyfriend: currentBoyfriend,
            startedAt: relationshipStartedAt,
            endedAt: block.timestamp,
            breakupReason: reason
        }));
        emit Breakup(currentBoyfriend, reason, block.timestamp);
        
        currentBoyfriend = address(0);
        relationshipStartedAt = 0;
    }

    function getRelationshipHistory() external view returns (Relationship[] memory) {
        return relationshipHistory;
    }

    function getRelationshipCount() external view returns (uint256) {
        return relationshipHistory.length;
    }

    function getFlirtCount(address suitor) external view returns (uint256) {
        return flirtCount[suitor];
    }

    function isInRelationship() external view returns (bool) {
        return currentBoyfriend != address(0);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
