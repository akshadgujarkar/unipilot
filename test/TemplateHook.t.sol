// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Deployers} from "@uniswap/v4-core/test/utils/Deployers.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "@uniswap/v4-core/src/types/PoolId.sol";
import {TemplateHook} from "../src/TemplateHook.sol";
import {HookMiner} from "./utils/HookMiner.sol";

contract TemplateHookTest is Test, Deployers {
    using PoolIdLibrary for PoolKey;

    TemplateHook public hook;
    PoolId public poolId;

    function setUp() public {
        // Deploy v4 pool manager and test routers
        deployFreshManagerAndRouters();

        // Deploy and approve test currencies
        deployMintAndApprove2Currencies();

        // Flag mask required by TemplateHook (currently 0)
        uint160 flags = 0;

        // Mine salt matching flags
        bytes memory constructorArgs = abi.encode(address(manager));
        (address hookAddress, bytes32 salt) = HookMiner.find(
            address(this),
            flags,
            type(TemplateHook).creationCode,
            constructorArgs
        );

        // Deploy hook via CREATE2
        hook = new TemplateHook{salt: salt}(manager);
        require(address(hook) == hookAddress, "Hook address mismatch");

        // Initialize pool with hook
        (key, poolId) = initPool(
            currency0,
            currency1,
            IHooks(address(hook)),
            3000,
            SQRT_PRICE_1_1
        );
    }

    function test_HookDeployment() public view {
        assertEq(address(hook.poolManager()), address(manager));
    }
}

