import { describe, it, expect, beforeEach } from 'vitest';

// Mock Data and Variables
let contractOwner = 'owner-principal';
let txSender = 'owner-principal';
let projects = {};
let contributions = {};
let projectIdNonce = 0;

// Error Constants
const errOwnerOnly = { err: 100 };
const errUnknownProject = { err: 101 };
const errInsufficientBalance = { err: 102 };
const errProjectClosed = { err: 104 };
const errBelowMinimum = { err: 105 };
const errProjectExists = { err: 103 };

// Mock Functions
const createProject = (name, description, targetAmount, minimumContribution, beneficiary, duration) => {
  if (txSender !== contractOwner) return errOwnerOnly;
  if (projects[projectIdNonce]) return errProjectExists;
  
  projects[projectIdNonce] = {
    name,
    description,
    targetAmount,
    minimumContribution,
    currentAmount: 0,
    beneficiary,
    isActive: true,
    endBlock: duration + projectIdNonce
  };
  
  projectIdNonce++;
  return { ok: projectIdNonce - 1 };
};

const contribute = (projectId, amount) => {
  const project = projects[projectId];
  if (!project) return errUnknownProject;
  if (!project.isActive) return errProjectClosed;
  if (amount < project.minimumContribution) return errBelowMinimum;
  
  project.currentAmount += amount;
  contributions[projectId] = contributions[projectId] || {};
  contributions[projectId][txSender] = (contributions[projectId][txSender] || 0) + amount;
  
  return { ok: true };
};

const completeProject = (projectId) => {
  const project = projects[projectId];
  if (!project) return errUnknownProject;
  if (txSender !== contractOwner) return errOwnerOnly;
  if (!project.isActive) return errProjectClosed;
  
  project.isActive = false;
  return { ok: true };
};

// Reset state before each test
beforeEach(() => {
  contractOwner = 'owner-principal';
  txSender = 'owner-principal';
  projects = {};
  contributions = {};
  projectIdNonce = 0;
});

// Tests
describe('Contribution Contract Tests', () => {
  it('should allow the owner to create a project', () => {
    const result = createProject('Project A', 'Description', 1000, 100, 'beneficiary-principal', 100);
    expect(result).toEqual({ ok: 0 });
    expect(projects[0].name).toEqual('Project A');
  });
  
  it('should not allow non-owners to create projects', () => {
    txSender = 'non-owner-principal';
    const result = createProject('Project B', 'Description', 1000, 100, 'beneficiary-principal', 100);
    expect(result).toEqual(errOwnerOnly);
  });
  
  it('should allow contributions above minimum to active project', () => {
    createProject('Project C', 'Description', 1000, 100, 'beneficiary-principal', 100);
    const result = contribute(0, 150);
    expect(result).toEqual({ ok: true });
    expect(projects[0].currentAmount).toEqual(150);
  });
  
  it('should reject contributions below the minimum amount', () => {
    createProject('Project D', 'Description', 1000, 100, 'beneficiary-principal', 100);
    const result = contribute(0, 50);
    expect(result).toEqual(errBelowMinimum);
  });
  
  it('should allow the owner to complete an active project', () => {
    createProject('Project E', 'Description', 1000, 100, 'beneficiary-principal', 100);
    const result = completeProject(0);
    expect(result).toEqual({ ok: true });
    expect(projects[0].isActive).toBe(false);
  });
  
  it('should not allow non-owners to complete projects', () => {
    createProject('Project F', 'Description', 1000, 100, 'beneficiary-principal', 100);
    txSender = 'non-owner-principal';
    const result = completeProject(0);
    expect(result).toEqual(errOwnerOnly);
  });
  
  it('should return an error for contributing to a closed project', () => {
    createProject('Project G', 'Description', 1000, 100, 'beneficiary-principal', 100);
    completeProject(0);
    const result = contribute(0, 150);
    expect(result).toEqual(errProjectClosed);
  });
});
