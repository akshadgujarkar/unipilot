// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {TemplateHook} from "../src/TemplateHook.sol";
import {HookMiner} from "../test/utils/HookMiner.sol";

/// @title DeployHookScript
/// @notice Script for mining salt and deploying hooks using the CREATE2 factory.
contract DeployHookScript is Script {
    // Canonical CREATE2 deployer on EVM chains
    address public constant CREATE2_DEPLOYER = 0x4e59b44847b379578588920cA78FbF26c0B4956C;

    function run() public {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0));
        address poolManagerAddress = vm.envOr("POOL_MANAGER", address(0x000000000004444c5dc75cB358380D2e3dE08A90));

        // Hook flags required by TemplateHook (currently 0)
        uint160 flags = 0;

        bytes memory constructorArgs = abi.encode(poolManagerAddress);
        (address hookAddress, bytes32 salt) = HookMiner.find(
            CREATE2_DEPLOYER,
            flags,
            type(TemplateHook).creationCode,
            constructorArgs
        );

        console2.log("Mined Hook Address:", hookAddress);
        console2.log("Mined Salt:");
        console2.logBytes32(salt);

        if (deployerPrivateKey != 0) {
            vm.startBroadcast(deployerPrivateKey);
            bytes memory bytecode = abi.encodePacked(type(TemplateHook).creationCode, constructorArgs);
            (bool success,) = CREATE2_DEPLOYER.call(abi.encodePacked(salt, bytecode));
            require(success, "Deployment failed");
            vm.stopBroadcast();
            console2.log("Hook deployed successfully to:", hookAddress);
        }
    }
}
