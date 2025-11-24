# NetCrab Billing Service

Revenue share calculation and payout service for marketplace sellers.

## Features

- Monthly payout calculation (5th of month)
- Revenue share distribution (70% to sellers, 30% platform fee)
- Stripe Connect integration for seller payouts
- Monthly statement generation

## Configuration

```bash
export STRIPE_SECRET_KEY=sk_...
export CLICKHOUSE_URL=http://localhost:8123
```

## Usage

```bash
pnpm build
pnpm start
```

## Payout Calculation

1. Calculate gross revenue per pack from Stripe subscriptions
2. Apply platform fee (30%)
3. Calculate org shares based on session contributions
4. Execute Stripe Connect transfers
5. Generate monthly statements

## Monthly Statement Format

JSON format with:
- Total amount
- Breakdown by pack
- Contribution sessions
- Share amounts
