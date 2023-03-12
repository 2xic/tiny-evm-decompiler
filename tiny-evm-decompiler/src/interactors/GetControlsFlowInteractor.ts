/**
 * Okay ,so we now have the blocks
 * We execute them in a simplistic EVM
 * Usually, we only care about the last argument before a branch instruction
 * We only care about the I/O on the stack, but I don't wanna reimplement this basic evm
 * So I will just reuse the tinyeth evm.
 */

import { CodeBlocks } from "./GetCodeBlocksInteractor";
import { OpcodeMnemonic } from 'tinyeth/dist/evm';
import { ParsedOpcodes } from "./GetOpcodesInteractor";
import { Logger } from "../helpers/Logger";
import { getOpcodeArgument } from "../helpers/getOpcodeArgument";

export class GetControlsFlowInteractor {
    public getControlFlow({
        codeBlocks
    }: {
        codeBlocks: CodeBlocks[]
    }): GraphCodeBlocks[] {
        const mappingCodeBlocks: GraphCodeBlocks[] = [];
        const logger = new Logger();

        for (const [index, codeblock] of Object.entries(codeBlocks)) {
            const calls: Set<string> = new Set([]);

            const jumpInstructions: string[] = [OpcodeMnemonic.JUMP, OpcodeMnemonic.JUMPI];
            codeblock.block.forEach((item, opcodeIndex) => {
                if (jumpInstructions.includes(item.opcode.mnemonic)) {
                    const prevOpcode = codeblock.block[opcodeIndex - 1];

                    if (prevOpcode.opcode.mnemonic.includes(OpcodeMnemonic.PUSH)) {
                        const argument = getOpcodeArgument(prevOpcode)
                        calls.add(argument)
                    }
                    if (item.opcode.mnemonic === OpcodeMnemonic.JUMPI) {
                        calls.add(
                            codeBlocks[parseInt(index) + 1].startAddress.toString(16)
                        )
                    }
                }
            });

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
