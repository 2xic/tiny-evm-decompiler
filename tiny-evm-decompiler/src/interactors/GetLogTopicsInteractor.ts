import BigNumber from "bignumber.js";
import { Address, ExposedEvm, getClassFromTestContainer, MnemonicParser, Wei } from "tinyeth";
import { getCodeBlock } from "../helpers/getOpcodesFromMnemonic";
import { CodeBlocks } from "./GetCodeBlocksInteractor";
import { GetControlsFlowInteractor } from "./GetControlsFlowInteractor";
import { ResolveOrphansInteractor } from "./ResolveOrphansInteractor";

export class GetLogTopicsInteractor {
    public async getLogTopics({
        codeBlocks
    }: {
        codeBlocks: CodeBlocks[]
    }): Promise<LogTopics[]> {
        const topics: LogTopics[] = [];
        const interactor = new ResolveOrphansInteractor();

        interactor.on('log', ({ stack, opcode }) => {
            if (opcode === 'LOG1') {
                topics.push({
                    offset: stack[stack.length - 3],
                    size: stack[stack.length - 2],
                    topic0: stack[stack.length - 1],
                })
            } else if (opcode === 'LOG2') {
                topics.push({
                    offset: stack[stack.length - 4],
                    size: stack[stack.length - 3],
                    topic1: stack[stack.length - 2],
                    topic0: stack[stack.length - 1],
                })
            } else if (opcode === 'LOG3') {
                topics.push({
                    offset: stack[stack.length - 5],
                    size: stack[stack.length - 4],
                    topic2: stack[stack.length - 3],
                    topic1: stack[stack.length - 2],
                    topic0: stack[stack.length - 1],
                })
            } else if (opcode === 'LOG4') {
                topics.push({
                    offset: stack[stack.length - 6],
                    size: stack[stack.length - 5],
                    topic3: stack[stack.length - 4],
                    topic2: stack[stack.length - 3],
                    topic1: stack[stack.length - 2],
                    topic0: stack[stack.length - 1],
                })
            }
        })
        interactor.resolve({
            codeBlocks: new GetControlsFlowInteractor().getControlFlow({
                codeBlocks
            })
        })

        return topics;
    }
}

export interface Log1 {
    topic0: bigint;
    offset: bigint;
    size: bigint;
}

export interface Log2 {
    topic0: bigint;
    topic1: bigint;
    offset: bigint;
    size: bigint;
}


export interface Log3 {
    topic0: bigint;
    topic1: bigint;
    topic2: bigint;
    topic3: bigint;
    offset: bigint;
    size: bigint;
}


export interface Log4 {
    topic0: bigint;
    topic1: bigint;
    topic2: bigint;
    topic3: bigint;
    topic4: bigint;
    offset: bigint;
    size: bigint;
}

export type LogTopics = Log4 | Log3 | Log2 | Log1;
