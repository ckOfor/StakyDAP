;; staking-token.clar

(define-fungible-token staking-token)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (ft-transfer? staking-token amount sender recipient)
  )
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? staking-token amount recipient)
  )
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance staking-token account))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply staking-token))
)

(define-read-only (get-token-uri)
  (ok none)
)

(define-read-only (get-name)
  (ok "Staking Token")
)

(define-read-only (get-symbol)
  (ok "STK")
)

(define-read-only (get-decimals)
  (ok u6)
)
