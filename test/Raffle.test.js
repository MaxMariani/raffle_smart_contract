const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledRaffle = require("../ethereum/build/Raffle.json");
const compiledFactory = require("../ethereum/build/RaffleFactory.json")

let accounts;
let raffleFactory;
let raffleAddress;
let raffle;

beforeEach(async () => {

    accounts = await web3.eth.getAccounts();

    raffleFactory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '2000000' });

    await raffleFactory.methods.createRaffle("100").send({
        from: accounts[0],
        gas: '1000000'
    });

    [raffleAddress] = await raffleFactory.methods.deployedRafflesList().call();
    raffle = await new web3.eth.Contract(compiledRaffle.abi, raffleAddress);
});

describe('Raffle & RaffleFactory', () => {

    it('Deploys the contracts', () => {
        assert.ok(raffleFactory.options.address);
        assert.ok(raffle.options.address);
    });

    it('Marks caller as Raffle manager', async () => {
        const manager = await raffle.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('Requires a precise amount to enter the raffle', async () => {
        let outcome;
        try {
            await raffle.methods.enterRaffle().send({
                from: accounts[1],
                value: '99'
            });
            outcome = 'success';
        } catch (err) {
            outcome = 'fail';
        }
        assert.equal('fail', outcome);
    });

    it('Allows one account to enter the raffle', async () => {
        await raffle.methods.enterRaffle().send({
            from: accounts[1],
            value: "100",
        });
        const partecipants = await raffle.methods.partecipantsList().call({
            from: accounts[0]
        });
        assert.equal(1, partecipants.length);
        assert.ok(partecipants[0], accounts[1]);
    });

    it('Allows multiple accounts to enter the raffle', async () => {
        await raffle.methods.enterRaffle().send({
            from: accounts[1],
            value: "100",
        });
        await raffle.methods.enterRaffle().send({
            from: accounts[2],
            value: "100",
        });
        const partecipants = await raffle.methods.partecipantsList().call({
            from: accounts[0]
        });
        assert.equal(2, partecipants.length);
        assert.ok(partecipants[0], accounts[1]);
        assert.ok(partecipants[1], accounts[2]);
    });

    it('Doesnt let the manager enter the raffle', async () => {
        let outcome;
        try {
            await raffle.methods.enterRaffle().send({
                from: accounts[0],
                value: '100'
            });
            outcome = 'success';
        } catch (err) {
            outcome = 'fail';
        }
        assert.equal('fail', outcome);
    });

    it('Only the manager can pick a winner', async () => {
        let outcome;
        try {
            await raffle.methods.pickWinner().send({
                from: accounts[1]
            })
            outcome = 'success';
        } catch (err) {
            outcome = 'fail';
        }
        assert.equal('fail', outcome);
    });

    it('Lets the manager pick a winner', async () => {
        await raffle.methods.enterRaffle().send({
            value: "100",
            from: accounts[1],
        });
        const pickWinner = await raffle.methods.pickWinner().send({
            from: accounts[0]
        });
        assert(pickWinner);
    });

    it('Doesnt let address enter the raffle when a winner has been chosen', async () => {
        await raffle.methods.enterRaffle().send({
            from: accounts[1],
            value: '100',
        });
        await raffle.methods.pickWinner().send({
            from: accounts[0]
        });
        let outcome;
        try {
            await raffle.methods.enterRaffle().send({
                from: accounts[0],
                value: '100'
            });
            outcome = 'success';
        } catch (err) {
            outcome = 'fail';
        }
        assert.equal('fail', outcome);
    });
});



