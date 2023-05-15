// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { Managerial } from "./Managerial.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DonationsEscrow is Managerial {
    using SafeERC20 for IERC20;

    address payable public recipientAddress;
    address payable public treasuryAddress;
    address public currencyAddress;

    mapping(address => uint256) public donations;
    mapping(address => bool) public existingDonors;
    address[] public donorAddresses;

    event DonationReceived(address indexed donor, uint256 amount);
    event DonationReleased(address indexed donor, uint256 amount);
    event DonationRefunded(address indexed donor, uint256 amount);

    function init(address _recipientAddress, address _treasuryAddress, address _currencyAddress) public {
        recipientAddress = payable(_recipientAddress);
        treasuryAddress = payable(_treasuryAddress);
        currencyAddress = _currencyAddress;

        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, _recipientAddress);
    }

    function addDonation(uint256 amount) public {
        require(amount > 0, "Please input a valid donation amount");

        IERC20(currencyAddress).safeTransferFrom(msg.sender, treasuryAddress, amount);
        emit DonationReceived(msg.sender, amount);
        
        uint256 existingDonation = 0;
        if (existingDonors[msg.sender] == true) {
            existingDonation = donations[msg.sender];
         }
        existingDonation += amount;
        existingDonors[msg.sender] = true;
        donations[msg.sender] = existingDonation;
        donorAddresses.push(payable(msg.sender));
    }

    function releaseDonations() public onlyManagers {
        uint256 totalDonations = IERC20(currencyAddress).balanceOf(address(this));
        IERC20(currencyAddress).safeTransfer(recipientAddress, totalDonations);
        emit DonationReleased(recipientAddress, totalDonations);
    }
    
    function refundDonations() public onlyManagers {
        uint256 donorSize = donorAddresses.length;
        for (uint256 i = 0; i < donorSize; i++) {
            address donorAddress = donorAddresses[i];
            uint256 amountDonated = donations[donorAddress];
            
            // void donor after refunding donation
            donations[donorAddress] = 0;
            existingDonors[donorAddress] = false;

            IERC20(currencyAddress).safeTransfer(donorAddress, amountDonated);

            emit DonationRefunded(donorAddress, amountDonated);
        }
    }
        
    function getDonorDonationAmount(address donor) public view returns (uint256 amount) {
        return donations[donor];
    }
}