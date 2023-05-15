// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { Managerial } from "./Managerial.sol";
import { DonationsEscrow } from "./DonationsEscrow.sol";
import { CloneFactory } from "./CloneFactory.sol";

contract DonationsEscrowFactory is Managerial, CloneFactory {
    
    address public immutable treasuryAddress;
    address public immutable currencyAddress;
    address public escrowAddress;

    // mapping(uint256 => bool) public activeProjects;

    // event ProjectActivated(address projectId);
    // event ProjectDeactivated(address projectId);

    // Set creator as admin and manager
    constructor(address _treasuryAddress, address _currencyAddress) {
        treasuryAddress = _treasuryAddress;
        currencyAddress = _currencyAddress;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
    }

    // Allow for upgrades in the future
    function setEscrowAddress(address _escrowAddress) external onlySuperAdmin {
        escrowAddress = _escrowAddress;
    }

    // Create a new escrow clone for each project, and delegateCalls to it
    function createEscrow(address recipient) 
    public onlySuperAdmin returns (address escrow) {
        DonationsEscrow escrow = DonationsEscrow(createClone(escrowAddress));
        escrow.init(recipient, treasuryAddress, currencyAddress);
        // activateProject(escrow);
        return address(escrow);
    }

    // function activateProject(address projectId) private {
    //     require(activeProjects[projectId] == false);
    //     activeProjects[projectId] = true;

    //     emit ProjectActivated(projectId);
    // }

    // function deactivateProject(address projectId) private {
    //     require(activeProjects[projectId] == true);

    //     activeProjects[projectId] = false;

    //     emit ProjectDeactivated(projectId);
    // }
}