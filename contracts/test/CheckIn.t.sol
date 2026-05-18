// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CheckIn} from "../src/CheckIn.sol";

contract CheckInTest is Test {
    CheckIn public checkIn;
    address public alice = makeAddr("alice");

    function setUp() public {
        checkIn = new CheckIn();
    }

    function test_CheckIn_EmitsEvent() public {
        vm.prank(alice);
        vm.expectEmit(true, false, false, true);
        emit CheckIn.CheckedIn(alice, block.timestamp / 1 days, 1);
        checkIn.checkIn();
    }

    function test_CheckIn_RevertsOnSecondSameDay() public {
        vm.startPrank(alice);
        checkIn.checkIn();
        vm.expectRevert(CheckIn.AlreadyCheckedInToday.selector);
        checkIn.checkIn();
        vm.stopPrank();
    }

    function test_CheckIn_RevertsOnEthSent() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        vm.expectRevert(CheckIn.EthNotAccepted.selector);
        checkIn.checkIn{value: 1 wei}();
    }

    function test_CheckIn_StreakIncrementsOnConsecutiveDays() public {
        vm.prank(alice);
        checkIn.checkIn();
        assertEq(checkIn.streak(alice), 1);

        vm.warp(block.timestamp + 1 days);
        vm.prank(alice);
        checkIn.checkIn();
        assertEq(checkIn.streak(alice), 2);
    }

    function test_CheckIn_StreakResetsAfterGap() public {
        vm.prank(alice);
        checkIn.checkIn();

        vm.warp(block.timestamp + 2 days);
        vm.prank(alice);
        checkIn.checkIn();
        assertEq(checkIn.streak(alice), 1);
    }

    function test_canCheckIn() public {
        assertTrue(checkIn.canCheckIn(alice));
        vm.prank(alice);
        checkIn.checkIn();
        assertFalse(checkIn.canCheckIn(alice));
    }
}
