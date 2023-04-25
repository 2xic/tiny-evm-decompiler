import { GetCodeBlocksInteractor } from "./GetCodeBlocksInteractor";
import { GetLogTopicsInteractor } from "./GetLogTopicsInteractor";
import { GetOpcodesInteractor } from "./GetOpcodesInteractor"

describe('GetLogTopicsInteractor', () => {
    it('should be able to find the topic id', async () => {
        const interactor = new GetLogTopicsInteractor();
        const opcodes = new GetOpcodesInteractor().getOpcodes({
            contract: Buffer.from('6080604052348015600f57600080fd5b506004361060285760003560e01c806312514bba14602d575b600080fd5b603c60383660046076565b603e565b005b60405181815233907f69ca02dd4edd7bf0a4abb9ed3b7af3f14778db5d61921c7dc7cd545266326de29060200160405180910390a250565b600060208284031215608757600080fd5b503591905056fea264697066735822122069fde629581323247d8a4004cb8110511db8008eedae76ad0efb27af7fd3c55464736f6c634300080d0033', 'hex')
        })
        const codeBlocks = new GetCodeBlocksInteractor().getCodeBlocks(opcodes)
        const response = await interactor.getLogTopics({
            codeBlocks,
        })
        expect(response).toHaveLength(1);
        /**
         * Because the symbolic stack is not fully implemented you get the deadbeef
         */
        expect(response[0].topic0).toMatchInlineSnapshot(`3735928559n`)
        if (!('topic1' in response[0])) {
            throw new Error('Something went wrong when trying to extract topics')
        }
        expect(response[0].topic1).toMatchInlineSnapshot(`2990629282966891838140932376749085414104752576181182852924263213638230371810n`)
        expect(response[0].offset).toMatchInlineSnapshot(`3735928559n`)
        expect(response[0].size).toMatchInlineSnapshot(`3735928559n`)
    })

    it('should be able to find multiple topic ids', async () => {
        const interactor = new GetLogTopicsInteractor();
        const opcodes = new GetOpcodesInteractor().getOpcodes({
            contract: Buffer.from('6080604052348015600f57600080fd5b506004361060325760003560e01c806312514bba146037578063dd235a2e146048575b600080fd5b6046604236600460d2565b6057565b005b6046605336600460d2565b6090565b60405181815233907f69ca02dd4edd7bf0a4abb9ed3b7af3f14778db5d61921c7dc7cd545266326de2906020015b60405180910390a250565b6040805182815260326020820152600a9181019190915233907fa2a03338969b524f15f7eb680e9d38b2e728ad8f14096e80531d944a73f8dd9a906060016085565b60006020828403121560e357600080fd5b503591905056fea2646970667358221220240cc836d176647ee7949b34f2321b5b6c2eaec456c41e00138b4ed3eaa3ff3464736f6c634300080d0033', 'hex')
        })
        const codeBlocks = new GetCodeBlocksInteractor().getCodeBlocks(opcodes)
        const response = await interactor.getLogTopics({
            codeBlocks,
        })
        expect(response).toHaveLength(2);
    })
})
