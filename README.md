# Ad discount exercise

## Setup

I used `node v20` for this exercise

Installing modules
```
npm install
```

Running tests
```
npm run test
```

Running linting
```
npm run lint
```

## Structure

I've split this project into 3 distinct categories.

- `src/Ads` - stores information pertaining to the 3 existing ad types and their pricing, pricing is measured in lowest denominator (cents)
- `src/Checkout` - handles storing items and calculation of final prices, as well as formatting, it is completely decoupled from any concept of a company, such that if a pricing strategy changes, the Checkout class can recalculate the total on the fly. Also handled formatting of the final total (eg 515 cents -> $5.15). 
- `src/PricingStrategy` - different kinds of pricing strategies can exist, these are extensible and can be passed to the `Checkout` class as an array, each one can have different logic for calculating a discount however each pricing strategy shares some similar traits

## Assumptions

- bad inputs will need validation
- two patterns identified in brief
  - group buy discount
  - fixed amount discount
- number of pricing/discount strategies can be increased in future
  - for example adding a 'percentage off' based discount 
- a pricing/discount strategy can handle one ad at a time
- all critical paths are to be tested from brief

## Other notes/considerations
- what happens if we want to add a new currency
- Checkout shoudl be extensible incase we want to persist data to a database or another place
- an `addItems()` method could be added to `Checkout` class to add multiple items at once
