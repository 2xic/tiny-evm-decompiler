import { GetCodeBlocksInteractor } from "./GetCodeBlocksInteractor";
import { GetLogTopicsInteractor } from "./GetLogTopicsInteractor";
import { GetOpcodesInteractor } from "./GetOpcodesInteractor"

describe('GetLogTopicsInteractor', () => {
    it('should be able to find the topic id', async () => {
        const interactor = new GetLogTopicsInteractor();
        const opcodes = new GetOpcodesInteractor().getOpcodes({
            contract: '6080604052348015600f57600080fd5b506004361060285760003560e01c806312514bba14602d575b600080fd5b603c60383660046076565b603e565b005b60405181815233907f69ca02dd4edd7bf0a4abb9ed3b7af3f14778db5d61921c7dc7cd545266326de29060200160405180910390a250565b600060208284031215608757600080fd5b503591905056fea264697066735822122069fde629581323247d8a4004cb8110511db8008eedae76ad0efb27af7fd3c55464736f6c634300080d0033'
        })
        const codeBlocks = new GetCodeBlocksInteractor().getCodeBlocks(opcodes)
        const response = await interactor.getLogTopics({
            codeBlocks,
        })
        expect(response).toHaveLength(1);
        expect(response[0].topic0).toMatchInlineSnapshot(`"102137596864728346170638619934991685713013445425038174730173252571921637618382"`)
        expect(response[0].topic1).toMatchInlineSnapshot(`"47849771978274583476054866359673822206892176540417600937783018660582038597090"`)
        expect(response[0].offset).toMatchInlineSnapshot(`"0"`)
        expect(response[0].size).toMatchInlineSnapshot(`"32"`)
    })
})
