// Algorithm as described in https://arxiv.org/pdf/2103.09113.pdf

import { OpcodeMnemonic } from "tinyeth";
import { MyEmitter } from "../helpers/MyEmitter";
import { SymbolStackExecution } from "../helpers/SymbolStackExecution";
import { CodeBLockProperty } from "./GetCodeBlocksInteractor";
import { GraphCodeBlocks } from "./GetControlsFlowInteractor";

export class ResolveOrphansInteractor extends MyEmitter<{
    log: {
        stack: bigint[],
        opcode: string
    }
}> {
    public resolve({
        codeBlocks: inputCodeBlocks
    }: {
        codeBlocks: GraphCodeBlocks[]
    }): GraphCodeBlocks[] {
        const codeBlocks = inputCodeBlocks.map((item) => {
            return {
                ...item,
                successors: [],
            }
        })
        const visited: Record<string, boolean> = {};
        const stack = new SymbolStackExecution();
        const queue: Array<[ExtendedCodeBlocks, SymbolStackExecution, string | null]> = []
        queue.push([
            codeBlocks[0],
            stack,
            null,
        ]);
        const inputEdges: Record<string, string[]> = {};
        codeBlocks.forEach((item) => {
            inputEdges[item.name] = [];
        });

        while (queue.length) {
            const [block, stack, _] = queue.shift();

            block.block.forEach((item) => {
                stack.executeOpcode({
                    opcode: item,
                })
                if (stack.lastOutput && item.opcode.mnemonic.includes(OpcodeMnemonic.LOG)){
                    this.emit('log', {
                        stack: stack.lastOutput,
                        opcode: item.opcode.mnemonic
                    })
                }
            });

            const lastOpcode = block.block[block.block.length - 1];

            if (lastOpcode.opcode.mnemonic === OpcodeMnemonic.JUMP) {
                const next = stack.lastOutput[0];
                const successorBlock = codeBlocks.find((item) => {
                    return item.startAddress === Number(next)
                })
                if (!successorBlock) {
                    console.error(`Did not find the JUMP successorBlock ${next.toString(16)} from ${block.name}`);
                } else {
                    block.successors.push(successorBlock);
                    if (!block.calls.includes(successorBlock.name)) {
                        block.calls.push(successorBlock.name)
                    }
                    inputEdges[successorBlock.name].push(block.name);
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
                            stack.clone(),
                            block.name,
                        ])
                    }
                    inputEdges[successor.name].push(block.name);
                });
            } else if (lastOpcode.opcode.mnemonic === OpcodeMnemonic.JUMP) {
                const next = stack.lastOutput[0];
                const successorBlock = codeBlocks.find((item) => {
                    return item.startAddress === Number(next)
                })

                if (!successorBlock) {
                    console.error(`Did not find the successorBlock (${next.toString(16)})  from ${block.name}`);
                } else {
                    const edge = `${block.startAddress.toString()}${successorBlock.startAddress.toString()}${stack.raw()}`;
                    if (!visited[edge]) {
                        queue.push([
                            successorBlock,
                            stack.clone(),
                            block.name,
                        ])
                    }
                }
            }
        }
        
        return codeBlocks.map((item) => {
            return {
                ...item,
                successors: undefined,
            }
        }).filter((item) => {
            const isStartBlock = item.name === '0';
            const canBeJumpedTo = isStartBlock || item.properties.includes(CodeBLockProperty.JUMPDEST);
            const isJumpedTo = inputEdges[item.name].length;
            const shouldBeIgnored = canBeJumpedTo || isJumpedTo;

            return shouldBeIgnored;  
        });
    }
}

export interface ExtendedCodeBlocks extends GraphCodeBlocks {
    successors: ExtendedCodeBlocks[];
}
