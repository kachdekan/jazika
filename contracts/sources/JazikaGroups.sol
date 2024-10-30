// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract JazikaGroups is AccessControl, ReentrancyGuard {
  bytes32 public constant ADMIN_ROLE = keccak256('ADMIN_ROLE');
  bytes32 public constant GROUP_MANAGER_ROLE = keccak256('GROUP_MANAGER_ROLE');

  IERC20 public groupToken;

  struct Group {
    string name;
    address manager;
    string inviteCode;
    uint256 totalLoanBalance;
    bool exists;
  }

  struct Member {
    uint256 groupId;
    uint256 loanBalance;
    bool exists;
  }

  mapping(uint256 => Group) public groups;
  mapping(address => Member) public members;
  mapping(uint256 => mapping(address => bool)) public groupMembers;

  uint256 private nextGroupId = 1;

  event GroupCreated(uint256 indexed groupId, string name, address manager);
  event MemberAdded(uint256 indexed groupId, address member);
  event MemberRemoved(uint256 indexed groupId, address member);
  event LoanRequested(uint256 indexed groupId, address member, uint256 amount);
  event LoanRepaid(uint256 indexed groupId, address member, uint256 amount);

  constructor(address _groupToken) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, msg.sender);
    groupToken = IERC20(_groupToken);
  }

  function createGroup(string memory name, string memory inviteCode) external returns (uint256) {
    require(members[msg.sender].groupId == 0, 'Already in a group');

    uint256 groupId = nextGroupId++;
    groups[groupId] = Group({
      name: name,
      manager: msg.sender,
      inviteCode: inviteCode,
      totalLoanBalance: 0,
      exists: true
    });

    _grantRole(GROUP_MANAGER_ROLE, msg.sender);
    members[msg.sender] = Member({ groupId: groupId, loanBalance: 0, exists: true });
    groupMembers[groupId][msg.sender] = true;

    emit GroupCreated(groupId, name, msg.sender);
    emit MemberAdded(groupId, msg.sender);
    return groupId;
  }

  function joinGroup(uint256 groupId, string memory inviteCode) external {
    require(groups[groupId].exists, 'Group does not exist');
    require(members[msg.sender].groupId == 0, 'Already in a group');
    require(
      keccak256(abi.encodePacked(groups[groupId].inviteCode)) ==
        keccak256(abi.encodePacked(inviteCode)),
      'Invalid invite code'
    );

    members[msg.sender] = Member({ groupId: groupId, loanBalance: 0, exists: true });
    groupMembers[groupId][msg.sender] = true;

    emit MemberAdded(groupId, msg.sender);
  }

  function removeMember(address member) external {
    require(hasRole(GROUP_MANAGER_ROLE, msg.sender), 'Not group manager');
    uint256 groupId = members[msg.sender].groupId;
    require(groups[groupId].manager == msg.sender, 'Not the manager of this group');
    require(groupMembers[groupId][member], 'Not a member of your group');
    require(members[member].loanBalance == 0, 'Member has outstanding loans');

    groupMembers[groupId][member] = false;
    members[member].exists = false;
    members[member].groupId = 0;

    emit MemberRemoved(groupId, member);
  }

  function requestLoan(uint256 amount) external nonReentrant {
    require(members[msg.sender].exists, 'Not a group member');
    require(amount > 0, 'Amount must be greater than 0');

    uint256 groupId = members[msg.sender].groupId;
    require(groupToken.balanceOf(address(this)) >= amount, 'Insufficient funds in contract');

    members[msg.sender].loanBalance += amount;
    groups[groupId].totalLoanBalance += amount;

    require(groupToken.transfer(msg.sender, amount), 'Token transfer failed');

    emit LoanRequested(groupId, msg.sender, amount);
  }

  function repayLoan(uint256 amount) external nonReentrant {
    require(members[msg.sender].exists, 'Not a group member');
    require(amount > 0, 'Amount must be greater than 0');
    require(members[msg.sender].loanBalance >= amount, 'Amount exceeds loan balance');

    uint256 groupId = members[msg.sender].groupId;

    require(groupToken.transferFrom(msg.sender, address(this), amount), 'Token transfer failed');

    members[msg.sender].loanBalance -= amount;
    groups[groupId].totalLoanBalance -= amount;

    emit LoanRepaid(groupId, msg.sender, amount);
  }

  // Helper functions
  function getMemberGroupId(address member) external view returns (uint256) {
    require(members[member].exists, 'Member does not exist');
    return members[member].groupId;
  }

  function getMemberLoanBalance(address member) external view returns (uint256) {
    require(members[member].exists, 'Member does not exist');
    return members[member].loanBalance;
  }

  function getGroupLoanBalance(uint256 groupId) external view returns (uint256) {
    require(groups[groupId].exists, 'Group does not exist');
    return groups[groupId].totalLoanBalance;
  }
}
