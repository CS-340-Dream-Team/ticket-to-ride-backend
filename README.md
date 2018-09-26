# Ticket to Ride Back End

## Client Subtree

To update the client subtree

```bash
git fetch client master
git subtree pull --prefix client client <BRANCH> --squash
```

## To Run Tests

```bash
yarn run test
```

or

```bash
yarn run test:watch
```

to run the tests as changes are made

## To Type-check

```bash
yarn run type-check
```

or

```bash
yarn run type-check:watch
```

to run the type-checks as changes are made.

## To Build

```bash
yarn run build
```

This will output to `lib/`
