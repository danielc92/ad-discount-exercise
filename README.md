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
