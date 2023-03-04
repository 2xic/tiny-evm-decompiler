/**
 * Okay ,so we now have the blocks
 * We execute them in a simplistic EVM
 * Usually, we only care about the last argument before a branch instruction
 * We only care about the I/O on the stack, but I don't wanna reimplement this basic evm
 * So I will just reuse the tinyeth evm.
 */

import { CodeBlocks } from "./GetCodeBlocksInteractor";
import { Address, ExposedEvm, MnemonicParser, StackUnderflow, Wei } from 'tinyeth/dist/evm';
import BigNumber from 'bignumber.js';
import { getClassFromTestContainer } from "tinyeth/dist/container/getClassFromTestContainer";

export class GetControlsFlowInteractor {
    public async getControlFlow({
    //    contract,
        codeBlocks
    }: {
     //   contract: string;
        codeBlocks: CodeBlocks[]
    }): Promise<GraphCodeBlocks[]> {
        const mappingCodeBlocks: GraphCodeBlocks[] = [];

        for(const [index, codeblock] of Object.entries(codeBlocks)){
            const calls: string[] = [];
            const evm = getClassFromTestContainer(ExposedEvm);
            console.log('');
            const code = (codeblock.block.filter((item) => {
                return item.opcode.isReal;
            }).map((item) =>{
                console.log(
                    `0x${item.offset.toString(16)} ${item.opcode.mnemonic} ${item.opcode.arguments.join(' ')}`
                )
                return `${item.opcode.mnemonic} ${item.opcode.arguments.join(' ')}`
            }))
            console.log('');
            const mnemonic2Buffer = new MnemonicParser().parse({
                script: code.join('\n')
            })
  //          console.log('')
//            console.log(code.join('\n'));
    //        console.log('')
            
            evm.boot({
                program: mnemonic2Buffer, //Buffer.from(contract, 'hex'),
                context: {
                    nonce: 1,
                    sender: new Address(),
                    receiver: new Address(),
                    gasLimit: new BigNumber(0),
                    value: new Wei(new BigNumber(8)),
                    data: Buffer.from('', 'hex'),
                },
            })
            evm.stack.push(new BigNumber(0));
            evm.stack.push(new BigNumber(0));
            evm.stack.push(new BigNumber(0));
            evm.stack.push(new BigNumber(0));
            const execute = async () => {
                try {
                    await evm.execute({
                        stopAtPc: mnemonic2Buffer.length - 1,
                    });
                    const opcode = evm.peekOpcode().opcode.mnemonic;
                    if (['JUMP', 'JUMPI'].includes(opcode)) {
                        const jumpAddress = evm.stack.pop();
                        calls.push(jumpAddress.toString(16))
                        if (opcode === 'JUMPI'){
                            // The next code block will be the fall through 
                            calls.push(
                                codeBlocks[parseInt(index) + 1].startAddress.toString(16)
                            )
                        }
                    }
                } catch (err) {
                    if (err instanceof StackUnderflow) {
                        console.log(err);
                        // okay
                        execute();
                    } else {
                        console.log(err);
                    }
                }
            }
            await execute();

            console.log({
                calls,
            })

            mappingCodeBlocks.push({
                ...codeblock,
                calls,
            })
        }

        return mappingCodeBlocks;
    }
}

export interface GraphCodeBlocks extends CodeBlocks{
    calls: string[];
}
