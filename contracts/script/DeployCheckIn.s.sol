// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {CheckIn} from "../src/CheckIn.sol";

contract DeployCheckIn is Script {
    function run() external returns (CheckIn) {
        vm.startBroadcast();
        CheckIn deployed = new CheckIn();
        vm.stopBroadcast();
        return deployed;
    }
}
