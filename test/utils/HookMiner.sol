// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";

/// @title HookMiner
/// @notice A utility library for mining CREATE2 salts to deploy hooks at valid hook addresses.
library HookMiner {
    uint160 internal constant FLAG_MASK = Hooks.ALL_HOOK_MASK;
    uint256 internal constant MAX_LOOP = 160_444;

    /// @notice Find a salt that produces a hook address matching the required flags
    /// @param deployer The address that deploys the hook
    /// @param flags The required hook flags
    /// @param creationCode The creation bytecode of the hook contract (e.g. type(Hook).creationCode)
    /// @param constructorArgs The abi-encoded constructor arguments
    /// @return hookAddress The computed hook address
    /// @return salt The salt to use with CREATE2
    function find(address deployer, uint160 flags, bytes memory creationCode, bytes memory constructorArgs)
        internal
        pure
        returns (address hookAddress, bytes32 salt)
    {
        flags = flags & FLAG_MASK;
        bytes memory creationCodeWithArgs = abi.encodePacked(creationCode, constructorArgs);

        for (uint256 i = 0; i < MAX_LOOP; i++) {
            salt = bytes32(i);
            hookAddress = computeAddress(deployer, salt, creationCodeWithArgs);

            if (uint160(hookAddress) & FLAG_MASK == flags) {
                return (hookAddress, salt);
            }
        }
        revert("HookMiner: could not find salt");
    }

    /// @notice Computes the CREATE2 address for a contract deployment
    function computeAddress(address deployer, bytes32 salt, bytes memory creationCodeWithArgs)
        internal
        pure
        returns (address)
    {
        return address(
            uint160(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            bytes1(0xFF),
                            deployer,
                            salt,
                            keccak256(creationCodeWithArgs)
                        )
                    )
                )
            )
        );
    }
}
