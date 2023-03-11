import BigNumber from "bignumber.js";
import { StackUnderflow } from "tinyeth";
import { ParsedOpcodes } from "../interactors/GetOpcodesInteractor";

class SymbolicOpcode {
    constructor(
        private options: Options
    ) { }

    public execute({ stack, opcode }: { stack: bigint[]; opcode: ParsedOpcodes }): bigint[] {
        if (this.options.execution) {
            const output = this.options.execution({
                stack,
                opcode
            });

            return output;
        } else {
            for (let i = 0; i < this.options.consumes; i++) {
                stack.pop();
            }
            for (let i = 0; i < this.options.outputs; i++) {
                stack.push(BigInt(0xdeadbeef));
            }

            return stack;
        }
    }
}

export const SymbolicOpcodes: Record<number, SymbolicOpcode> = {
    0x1: new SymbolicOpcode({
        outputs: 1,
        consumes: 2,
    }),
    0x3: new SymbolicOpcode({
        outputs: 1,
        consumes: 2,
    }),
    0x14: new SymbolicOpcode({
        outputs: 1,
        consumes: 2,
    }),
    0x16: new SymbolicOpcode({
        outputs: 1,
        consumes: 2,
        execution: ({ stack }) => {
            const item = stack;
            const a: bigint = stack.pop();
            const b: bigint = stack.pop();
            const c = a & b;

            item.push(c);

            return item;
        }
    }),
    0x1b: new SymbolicOpcode({
        outputs: 1,
        consumes: 2,
    }),
    0x1c: new SymbolicOpcode({
        outputs: 1,
        consumes: 2,
    }),
    0xf3: new SymbolicOpcode({
        outputs: 2,
        consumes: 0,
    }),
    0x50: new SymbolicOpcode({
        outputs: 0,
        consumes: 1,
    }),
    0x51: new SymbolicOpcode({
        outputs: 1,
        consumes: 1,
    }),
    // JUMP
    0x56: new SymbolicOpcode({
        outputs: 0,
        // We need that
        consumes: 0,
    }),
    // PUSH
    ...repeatOpcode(0x60, 0x7f, () => new SymbolicOpcode({
        outputs: 0,
        consumes: 1,
        execution: ({ stack, opcode }) => {
            const item = stack;
            const argument = opcode.opcode.arguments.map((item) => {
                if (!(typeof item === 'string')){
                    throw new Error(`Bad argument type ${item}`)
                }
                return item.slice(2);//.toString(16);
            }).join('')
            stack.push(BigInt(`0x${argument}`));

            return item;
        }
    })),
    // DUP
    ...repeatOpcode(0x80, 0x8f, (index) => new SymbolicOpcode({
        outputs: 0,
        consumes: 1,
        execution: ({ stack }) => {
            const item = stack;
            stack.push(stack[index - 1]);
            return item;
        }
    })),
    // SWAP
    ...repeatOpcode(0x90, 0x9f, (index) => new SymbolicOpcode({
        outputs: 1,
        consumes: 1,
        execution: ({ stack }) => {
            const item = stack;
            [stack[0], stack[index - 1]] = [stack[index - 1], stack[0]];
 
            // console.log(stack)
            // console.log(index)

            return item;
        }
    })),
    0x52: new SymbolicOpcode({
        outputs: 0,
        consumes: 2,
    }),
    0x34: new SymbolicOpcode({
        outputs: 1,
        consumes: 0,
    }),
    0x35: new SymbolicOpcode({
        outputs: 1,
        consumes: 1,
    }),
    0x36: new SymbolicOpcode({
        outputs: 1,
        consumes: 0,
    }),
    0x10: new SymbolicOpcode({
        outputs: 1,
        consumes: 2,
    }),
    0x11: new SymbolicOpcode({
        outputs: 1,
        consumes: 2,
    }),
    0x15: new SymbolicOpcode({
        outputs: 1,
        consumes: 1,
    }),
    0x19: new SymbolicOpcode({
        outputs: 1,
        consumes: 1,
    }),
    0x57: new SymbolicOpcode({
        outputs: 0,
        consumes: 2,
    }),
    0x5b: new SymbolicOpcode({
        outputs: 0,
        consumes: 0,
    }),
    0xfd: new SymbolicOpcode({
        outputs: 0,
        consumes: 2,
    })
}

function repeatOpcode(
    from: number,
    to: number,
    opcode: (index: number) => SymbolicOpcode
) {
    const dict: Record<number, SymbolicOpcode> = {};

    for (let i = from; i <= to; i++) {
        dict[i] = opcode((i - from) + 1);
    }
    return dict;
}


interface Options {
    consumes: number;
    outputs: number;
    execution?: (options: { stack: bigint[]; opcode: ParsedOpcodes }) => bigint[]
}
