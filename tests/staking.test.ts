import { describe, it, expect, beforeEach } from 'vitest';

// Mock data
let contractOwner = 'owner-principal'; // Simulated contract owner
let txSender = 'owner-principal'; // Simulated transaction sender
let balances: Record<string, number> = {}; // Simulated balances
let totalSupply = 0; // Simulated total supply
const stakingTokenName = "Staking Token";
const stakingTokenSymbol = "STK";
const stakingTokenDecimals = 6;

// Mock contract functions

// Function to mint tokens
const mint = (amount: number, recipient: string) => {
  if (txSender !== contractOwner) return { err: 1000 }; // Unauthorized
  balances[recipient] = (balances[recipient] || 0) + amount; // Mint tokens
  totalSupply += amount; // Update total supply
  return { ok: balances[recipient] }; // Return recipient balance
};

// Function to transfer tokens
const transfer = (amount: number, sender: string, recipient: string) => {
  if (txSender !== sender) return { err: 101 }; // Not token owner
  if ((balances[sender] || 0) < amount) return { err: 102 }; // Insufficient balance
  balances[sender] -= amount; // Deduct from sender
  balances[recipient] = (balances[recipient] || 0) + amount; // Add to recipient
  return { ok: balances[recipient] }; // Return recipient balance
};

// Function to get balance
const getBalance = (account: string) => {
  return { ok: balances[account] || 0 }; // Return account balance
};

// Function to get total supply
const getTotalSupply = () => {
  return { ok: totalSupply }; // Return total supply
};

// Resetting state before each test
beforeEach(() => {
  contractOwner = 'owner-principal'; // Reset contract owner
  txSender = 'owner-principal'; // Reset transaction sender
  balances = {}; // Reset balances
  totalSupply = 0; // Reset total supply
});

// Tests
describe('Staking Token Contract Tests', () => {
  it('should allow the owner to mint tokens', () => {
    const result = mint(100, 'recipient-principal'); // Mint 100 tokens
    expect(result).toEqual({ ok: 100 }); // Recipient balance should be 100
    expect(totalSupply).toEqual(100); // Total supply should be 100
  });
  
  it('should not allow unauthorized users to mint tokens', () => {
    txSender = 'another-principal'; // Simulate unauthorized user
    const result = mint(100, 'recipient-principal'); // Attempt to mint tokens
    expect(result).toEqual({ err: 1000 }); // Should return unauthorized error
  });
  
  it('should return the balance of an account', () => {
    mint(100, 'recipient-principal'); // Mint 100 tokens
    const result = getBalance('recipient-principal'); // Get balance
    expect(result).toEqual({ ok: 100 }); // Should return 100
  });
  
  it('should return the total supply of tokens', () => {
    mint(200, 'recipient-principal'); // Mint 200 tokens
    const result = getTotalSupply(); // Get total supply
    expect(result).toEqual({ ok: 200 }); // Should return 200
  });
});
