import { GetContractFunctionsInteractor } from "./GetContractFunctionsInteractor"

describe('GetContractFunctionsInteractor', () => {
    it('should find functions in counter.col', async () => {
        const interactor = new GetContractFunctionsInteractor();
        const contract = Buffer.from('6080604052348015600f57600080fd5b506004361060465760003560e01c806306661abd14604b578063371303c01460655780636d4ce63c14606d578063b3bcfa82146074575b600080fd5b605360005481565b60405190815260200160405180910390f35b606b607a565b005b6000546053565b606b6091565b6001600080828254608a919060b7565b9091555050565b6001600080828254608a919060cc565b634e487b7160e01b600052601160045260246000fd5b6000821982111560c75760c760a1565b500190565b60008282101560db5760db60a1565b50039056fea2646970667358221220ad35c05902f8a1909cfc3ce86e414cabecc82bdd0d47b4695fb05f8171e31b8764736f6c634300080d0033', 'hex')
        const results = await interactor.getFunctions({
            contract
        });
        const values = results.map((item) => item.value)
        const expectedSelectros = ['6661abd', '371303c0', '6d4ce63c', 'b3bcfa82']
        for(const i of expectedSelectros){
            expect(values.includes(i)).toBe(true)
        }
    })

    it('should find functions', async () => {
        const interactor = new GetContractFunctionsInteractor();
        // function sayHelloWorld() public pure returns (string memory)
        const contract = Buffer.from('6080604052348015600f57600080fd5b506004361060325760003560e01c806345773e4e14603757806382edd49d146074575b600080fd5b60408051808201909152601181527048656c6c6f20576f726c642c206f6b617960781b60208201525b604051606b91906098565b60405180910390f35b60408051808201909152600981526848656c6c6f2065766d60b81b60208201526060565b600060208083528351808285015260005b8181101560c35785810183015185820160400152820160a9565b8181111560d4576000604083870101525b50601f01601f191692909201604001939250505056fea2646970667358221220718e1dc741aae07cfb2239bdf12ead573a6b5108d123e229939d9c7ee039941664736f6c634300080d0033', 'hex')
        const results = await interactor.getFunctions({
            contract
        });
        const values = results.map((item) => item.value)
        const expectedSelectros = ['82edd49d', '45773e4e']
        for(const i of expectedSelectros){
            expect(values.includes(i)).toBe(true)
        }
    })
})
