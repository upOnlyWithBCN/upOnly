// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/security/Pausable.sol';

abstract contract Managerial is AccessControl, Pausable {
    bytes32 public constant MANAGER_ROLE = keccak256('MANAGER_ROLE');

    modifier onlySuperAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            'Caller is not a superadmin'
        );
        _;
    }

    modifier onlyManagers() {
        require(hasRole(MANAGER_ROLE, msg.sender), 'Caller is not a manager');
        _;
    }

    function addManager(address target) external onlySuperAdmin {
        require(target != address(0), 'inval address');
        _grantRole(MANAGER_ROLE, target);
    }

    function removeManager(address target) external onlySuperAdmin {
        require(target != address(0), 'inval address');
        _revokeRole(MANAGER_ROLE, target);
    }

    function pause() external onlyManagers {
        _pause();
    }

    function unpause() external onlyManagers {
        _unpause();
    }
}
