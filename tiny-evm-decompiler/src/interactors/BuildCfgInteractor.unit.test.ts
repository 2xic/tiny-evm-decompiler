import { BuildCfgInteractor } from "./BuildCfgInteractor";
import { GetOpcodesInteractor } from "./GetOpcodesInteractor";


describe('BuildCfgInteractor', () => {
    it('should create a cfg', async () => {
        const interactor = new BuildCfgInteractor();
        const opcodes = new GetOpcodesInteractor().getOpcodes({
            contract: Buffer.from('6080604052348015600f57600080fd5b506004361060285760003560e01c806312514bba14602d575b600080fd5b603c60383660046076565b603e565b005b60405181815233907f69ca02dd4edd7bf0a4abb9ed3b7af3f14778db5d61921c7dc7cd545266326de29060200160405180910390a250565b600060208284031215608757600080fd5b503591905056fea264697066735822122069fde629581323247d8a4004cb8110511db8008eedae76ad0efb27af7fd3c55464736f6c634300080d0033', 'hex')
        })
        const cfg = await interactor.build({opcodes})
        expect(cfg).toMatchSnapshot();
    })
})