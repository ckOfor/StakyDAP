;; contribution.clar

;; Define token trait for fungible token interactions
(define-trait ft-trait
  (
    ;; Function to transfer tokens
    (transfer (uint principal principal) (response bool uint))
    ;; Function to get balance
    (get-balance (principal) (response uint uint))
  )
)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-unknown-project (err u101))
(define-constant err-insufficient-balance (err u102))
(define-constant err-project-exists (err u103))
(define-constant err-project-closed (err u104))
(define-constant err-below-minimum (err u105))

;; Project status types
(define-data-var project-id-nonce uint u0)

;; Data maps
(define-map projects
  uint  ;; project-id
  {
    name: (string-ascii 50),
    description: (string-ascii 500),
    target-amount: uint,
    minimum-contribution: uint,
    current-amount: uint,
    beneficiary: principal,
    is-active: bool,
    end-block: uint
  }
)

(define-map contributions
  {project-id: uint, contributor: principal}
  {
    amount: uint,
    block-height: uint
  }
)

;; Project status types
(define-data-var project-id-nonce uint u0)

;; Data maps
(define-map projects
  uint  ;; project-id
  {
    name: (string-ascii 50),
    description: (string-ascii 500),
    target-amount: uint,
    minimum-contribution: uint,
    current-amount: uint,
    beneficiary: principal,
    is-active: bool,
    end-block: uint
  }
)

(define-map contributions
  {project-id: uint, contributor: principal}
  {
    amount: uint,
    block-height: uint
  }
)
