## Raffle Smart Contract

Soldity Smart Contract based on [Raffle](https://en.wikipedia.org/wiki/Raffle) Gambling competition.

## SC's Description

Actors:

- Manager: who creates the Contract
- Partecipant: player that needs to pay money (contribution) to enter the raffle.

Behaviors:

- Only Partecipant can join the raffle, the manager earns 20% of the contract's total balance once a winner has been picked.
- Managers cannot join the raffle as partecipants.
- Only the manager can pick a winner.
- Once a winner has been draw, the raffle will be marked as close, and addresses are no more allowed to join.


## Installation
Clone the project

```bash
  git clone https://github.com/MaxMariani/raffle_smart_contract
```

Go to the project directory

```bash
  cd raffle_smart_contract
```

Install dependencies

```bash
  npm install
```

Generate Build folder

```bash
  cd ethereum
  node compile.js
```
    
## Running Tests

To run tests with mocha, run the following command

```bash
  npm run test
```

## Support & Feedback

For support, email wmaxmariani[at]gmail.com .


## 🔗 Links
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/max-mariani-developer/)


