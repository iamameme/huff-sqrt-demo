const BN = require('bn.js');
const { Runtime, getNewVM } = require('../../src/runtime.js');

const main = new Runtime('erc20.huff', __dirname);
const vm = getNewVM();

const logSteps = false;
const logGas = false;

if (logSteps) {
    vm.on('step', (data) => {
        console.log(`Opcode: ${data.opcode.name}\tStack: ${data.stack}`);
    });
}

async function init(caller) {
    const initialMemory = []; const inputStack = []; const calldata = []; const
        callvalue = 0;
    const callerAddr = caller;
    await main(vm, 'ERC20', inputStack, initialMemory, calldata, callvalue, callerAddr);
}

async function getTotalSupply() {
    const calldata = [{ index: 0, value: 0x18160ddd, len: 4 }, { index: 4, value: new BN(400), len: 32}];
    const initialMemory = []; const inputStack = []; const
        callvalue = 0;
    const callerAddr = 0; // callerAddr doesn't matter
    const data = await main(vm, 'ERC20__MAIN', inputStack, initialMemory, calldata, callvalue, callerAddr);
    if (logGas) { console.log(`Gas used by totalSupply(): ${data.gas}`); }
    console.log(data.stack.map(x => x.words.join(',')));
    return new BN(data.returnValue.toString('hex'), 16);
}

async function getBalanceOf(owner) {
    const calldata = [{ index: 0, value: 0x70a08231, len: 4 }, { index: 4, value: owner, len: 32 }];
    const initialMemory = []; const inputStack = []; const
        callvalue = 0;
    const callerAddr = 0; // callerAddr doesn't matter
    const data = await main(vm, 'ERC20__MAIN', inputStack, initialMemory, calldata, callvalue, callerAddr);
    if (logGas) { console.log(`Gas used by balanceOf(...): ${data.gas}`); }
    return new BN(data.returnValue.toString('hex'), 16);
}

async function mint(caller, to, value) {
    const calldata = [{ index: 0, value: 0x40c10f19, len: 4 },
        { index: 4, value: to, len: 32 },
        { index: 36, value, len: 32 }];
    const initialMemory = []; const inputStack = []; const
        callvalue = 0;
    const callerAddr = caller;
    const data = await main(vm, 'ERC20__MAIN', inputStack, initialMemory, calldata, callvalue, callerAddr);
    if (logGas) { console.log(`Gas used by mint(...): ${data.gas}`); }
}

module.exports = {
    init, getTotalSupply, getBalanceOf, mint,
};
