// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Admins is Ownable {
    event NewAdmin(address indexed _sender, address indexed _newAdmin);
    event AdminRemoval(address indexed _sender, address indexed _removedAdmin);

    mapping(address => bool) private _adminRole;

    constructor() {
        _addAdmin(_msgSender());
    }

    function _addAdmin(address newAdmin) private {
        _adminRole[newAdmin] = true;
        emit NewAdmin(_msgSender(), newAdmin);
    }

    function addAdmin(address newAdmin) external onlyOwner {
        require(!_isAdmin(newAdmin), "Admins: Address is already admin.");
        _addAdmin(newAdmin);
    }

    function addAdmins(address[] memory newAdmins) external onlyOwner {
        for (uint256 i = 0; i < newAdmins.length; i++) {
            require(
                !_isAdmin(newAdmins[i]),
                "Admins: Address is already admin."
            );
            _addAdmin(newAdmins[i]);
        }
    }

    function _removeAdmin(address admin) private {
        _adminRole[admin] = false;
        emit AdminRemoval(_msgSender(), admin);
    }

    function removeAdmin(address admin) external onlyOwner {
        require(_isAdmin(admin), "Admins: Address is not admin.");
        _removeAdmin(admin);
    }

    function _isAdmin(address someAddress) private view returns (bool) {
        return _adminRole[someAddress];
    }

    modifier onlyAdmins() {
        require(_isAdmin(_msgSender()), "Admins: caller is not an admin.");
        _;
    }

    function isAdmin() external view returns (bool) {
        return _isAdmin(_msgSender());
    }

    function isAdminAddress(address someAddress)
        external
        view
        onlyAdmins
        returns (bool)
    {
        return _isAdmin(someAddress);
    }
}
