/**
 * Okay ,so we now have the blocks
 * We execute them in a simplistic EVM
 * Usually, we only care about the last argument before a branch instruction
 * We only care about the I/O on the stack, but I don't wanna reimplement this basic evm
 * So I will just reuse the tinyeth evm.
 */

import { CodeBlocks } from "./GetCodeBlocksInteractor";
import { Address, ExposedEvm, MnemonicParser, OpcodeMnemonic, StackUnderflow, Wei } from 'tinyeth/dist/evm';
import BigNumber from 'bignumber.js';
import { getClassFromTestContainer } from "tinyeth/dist/container/getClassFromTestContainer";
import { ParsedOpcodes } from "./GetOpcodesInteractor";
import { Logger } from "../helpers/Logger";
import { getCodeBlock } from "../helpers/getOpcodesFromMnemonic";

const DEBUG = false;

export class GetControlsFlowInteractor {
    public async getControlFlow({
        codeBlocks
    }: {
        codeBlocks: CodeBlocks[]
    }): Promise<GraphCodeBlocks[]> {
        const mappingCodeBlocks: GraphCodeBlocks[] = [];
        const logger = new Logger();

        for (const [index, codeblock] of Object.entries(codeBlocks)) {
            const calls: Set<string> = new Set([]);
            const evm = getClassFromTestContainer(ExposedEvm);
            const mnemonic2Buffer = getCodeBlock({ codeblock })

            // Hack to align the stack
            for (let i = 0; i < 32; i++) {
                evm.stack.push(new BigNumber('inf'))
            }

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

            const jumpInstructions: string[] = [OpcodeMnemonic.JUMP, OpcodeMnemonic.JUMPI];
            const execute = async () => {
                try {
                    await evm.execute({
                        stopAtPc: mnemonic2Buffer.length - 1,
                    });
                    const opcode = evm.peekOpcode().opcode.mnemonic;
                    if (jumpInstructions.includes(opcode)) {
                        const jumpAddress = evm.stack.pop();
                        if (!jumpAddress.isNaN()) {
                            calls.add(jumpAddress.toString(16))
                        }
                        if (opcode === OpcodeMnemonic.JUMPI) {
                            calls.add(
                                codeBlocks[parseInt(index) + 1].startAddress.toString(16)
                            )
                        }
                    }
                } catch (err) {
                    logger.log(err);
                }
            }
            await execute();

            const fallThoughtAddress = this.getFallThoughtAddress({
                index,
                codeBlocks,
            });
            if (fallThoughtAddress) {
                calls.add(fallThoughtAddress)
            }

            mappingCodeBlocks.push({
                ...codeblock,
                calls: [...calls],
            })
        }

        return mappingCodeBlocks;
    }

    private getFallThoughtAddress({ index, codeBlocks }: {
        index: string;
        codeBlocks: CodeBlocks[]
    }) {
        const codeBlock: ParsedOpcodes[] = codeBlocks[index].block;
        if (codeBlock[0].opcode.isReal) {
            const nextIndex = parseInt(index) + 1;

            const lastOpcode = codeBlock[codeBlock.length - 1].opcode;

            const terminal: string[] = [
                OpcodeMnemonic.STOP,
                OpcodeMnemonic.RETURN,
                OpcodeMnemonic.JUMP,
                OpcodeMnemonic.REVERT
            ];

            if (terminal.includes(lastOpcode.mnemonic)) {
                return null;
            }

            if (nextIndex < codeBlocks.length) {
                const nextBlock = codeBlocks[nextIndex];
                const address = nextBlock.startAddress.toString(16);
                return address;
            }
        }
    }
}

export interface GraphCodeBlocks extends CodeBlocks {
    calls: string[];
}
