# Multiple admins contract

Inherits from [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts)'s [Ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol) contract.

run `npm install`

## Modifier
### `onlyAdmins`
Reverts if sender is not an admin.


## Events

### `NewAdmin`
```solidity
event NewAdmin(address indexed _sender, address indexed _newAdmin)
```

### `AdminRemoval`
```solidity
event AdminRemoval(address indexed _sender, address indexed _removedAdmin)
```
## Constructor
Sets sender as admin.

## External functions

### `addAdmin`
```solidity
function addAdmin(address newAdmin) external onlyOwner
```

### `addAdmins`
```solidity
function addAdmins(address[] memory newAdmins) external onlyOwner
```

### `removeAdmin`
```solidity
function removeAdmin(address admin) external onlyOwner
```

### `isAdmin`
```solidity
function isAdmin() external view returns (bool)
```

### `isAdminAddress`
```solidity
function isAdminAddress(address someAddress)
```



