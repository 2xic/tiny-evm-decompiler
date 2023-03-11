// Algorithm as described in https://arxiv.org/pdf/2103.09113.pdf

import { OpcodeMnemonic } from "tinyeth";
import { SymbolStackExecution } from "../helpers/SymbolStackExecution";
import { GraphCodeBlocks } from "./GetControlsFlowInteractor";

export class ResolveOrphansInteractor {
    public resolve({
        codeBlocks: bb
    }: {
        codeBlocks: GraphCodeBlocks[]
    }): GraphCodeBlocks[] {
        const codeBlocks = bb.map((item) => {
            return {
                ...item,
                successors: [],
            }
        })
        const visited: Record<string, boolean> = {};
        const stack = new SymbolStackExecution();
        const queue: Array<[ExtendedCodeBlocks, SymbolStackExecution]> = []
        queue.push([
            codeBlocks[0],
            stack
        ]);

        while (queue.length) {
            const [block, stack] = queue.shift();
            block.block.forEach((item) => {
                stack.executeOpcode({
                    opcode: item,
                })
            });

            const lastOpcode = block.block[block.block.length - 1];

            if (lastOpcode.opcode.mnemonic === OpcodeMnemonic.JUMP) {
                const next = stack.peek();
                const successorBlock = codeBlocks.find((item) => {
                    return item.startAddress === Number(next)
                })
                if (!successorBlock) {
                    throw new Error(`Did not find the JUMP successorBlock ${next.toString(16)} from ${block.name}`);
                }
                block.successors.push(successorBlock);
                if (!block.calls.includes(successorBlock.name)) {
                    block.calls.push(successorBlock.name)
                }
            }

            // *Building the edges*
            if (lastOpcode.opcode.mnemonic !== OpcodeMnemonic.JUMP) {
                block.calls.forEach((call) => {
                    const successor = codeBlocks.find((item) => item.name === call);
                    if (!successor) {
                        throw new Error('Something is wrong');
                    }
                    const edge = `${block.startAddress.toString()}${successor.startAddress.toString()}${stack.raw()}`;
                    if (!visited[edge]) {
                        visited[edge] = true;
                        queue.push([
                            successor,
                            stack.clone()
                        ])
                    }
                });
            } else if (lastOpcode.opcode.mnemonic === OpcodeMnemonic.JUMP) {
                const next = stack.peek();
                const successorBlock = codeBlocks.find((item) => {
                    return item.startAddress === Number(next)
                })

                if (!successorBlock) {
                    throw new Error(`Did not find the successorBlock (${next.toString(16)})  from ${block.name}`);
                }
                stack.pop();

                const edge = `${block.startAddress.toString()}${successorBlock.startAddress.toString()}${stack.raw()}`;
                if (!visited[edge]) {
                    queue.push([
                        successorBlock,
                        stack.clone()
                    ])
                }
            }
        }
        return codeBlocks.map((item) => {
            return {
                ...item,
                successors: undefined,
            }
        });
    }
}

export interface ExtendedCodeBlocks extends GraphCodeBlocks {
    successors: ExtendedCodeBlocks[];
}
