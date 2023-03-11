import BigNumber from "bignumber.js";
import { Address, ExposedEvm, getClassFromTestContainer, MnemonicParser, Wei } from "tinyeth";
import { getCodeBlock } from "../helpers/getOpcodesFromMnemonic";
import { CodeBlocks } from "./GetCodeBlocksInteractor";

export class GetLogTopicsInteractor {
    public async getLogTopics({
        codeBlocks
    }: {
        codeBlocks: CodeBlocks[]
    }): Promise<LogTopics[]> {
        const blocksOfInterest = codeBlocks.filter((item) => item.properties.length);
        const topics: LogTopics[] = [];
        for (const codeblock of blocksOfInterest) {
            const evm = getClassFromTestContainer(ExposedEvm);
            const mnemonic2Buffer = getCodeBlock({ codeblock })

            try {
                evm.boot({
                    program: mnemonic2Buffer,
                    context: {
                        nonce: 1,
                        sender: new Address(),
                        receiver: new Address(),
                        gasLimit: new BigNumber(0),
                        value: new Wei(new BigNumber(8)),
                        data: Buffer.from('', 'hex'),
                    },
                })
    
                await evm.execute({
                    stopAtOpcodes: [0xa0, 0xa1, 0xa2, 0xa3, 0xa4]
                })
    
                const opcode = evm.peekOpcode().opcodeNumber;
                if (opcode == 0xa2) {
                    topics.push({
                        offset: evm.stack.pop(),
                        size: evm.stack.pop(),
                        topic1: evm.stack.pop(),
                        topic0: evm.stack.pop(),
                    })
                } else {
                    throw new Error('Not implemented');
                }                
            } catch(err){
                console.log(err);
            }

        }

        return topics;
    }
}

export interface Log2 {
    topic0: BigNumber;
    topic1: BigNumber;
    offset: BigNumber;
    size: BigNumber;
}

export type LogTopics = Log2;
