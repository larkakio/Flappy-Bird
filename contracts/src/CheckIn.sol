// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Daily check-in on Base (gas-only, no ETH fee)
contract CheckIn {
    uint256 public constant CHECK_IN_FEE = 0;

    event CheckedIn(address indexed user, uint256 dayIndex, uint256 streak);

    error AlreadyCheckedInToday();
    error EthNotAccepted();

    /// @dev Stored as dayIndex + 1 so 0 means "never checked in"
    mapping(address => uint256) public lastDayIndex;
    mapping(address => uint256) public streak;

    function checkIn() external payable {
        if (msg.value != 0) revert EthNotAccepted();

        uint256 dayIndex = block.timestamp / 1 days;
        address user = msg.sender;
        uint256 stored = lastDayIndex[user];

        if (stored != 0 && stored - 1 == dayIndex) {
            revert AlreadyCheckedInToday();
        }

        uint256 newStreak = 1;
        if (stored != 0 && stored - 1 == dayIndex - 1) {
            newStreak = streak[user] + 1;
        }

        lastDayIndex[user] = dayIndex + 1;
        streak[user] = newStreak;

        emit CheckedIn(user, dayIndex, newStreak);
    }

    function canCheckIn(address user) external view returns (bool) {
        uint256 dayIndex = block.timestamp / 1 days;
        uint256 stored = lastDayIndex[user];
        return stored == 0 || stored - 1 != dayIndex;
    }
}
