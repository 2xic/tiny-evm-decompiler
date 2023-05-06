import { ParsedOpcodes } from "../interactors/GetOpcodesInteractor";
import { getOpcodeArgument } from "./getOpcodeArgument";

class SymbolicOpcode {
    constructor(
        private options: Options
    ) { }

    public execute({ stack, opcode }: { stack: bigint[]; opcode: ParsedOpcodes }): {
        stack: bigint[];
        output: null | bigint[]
    } {
        if (this.options.execution) {
            const { stack: stackOutput, output } = this.options.execution({
                stack,
                opcode
            });

            return {
                stack: stackOutput,
                output: output,
            };
        } else {
            const output: bigint[] = []
            for (let i = 0; i < this.options.consumes; i++) {
                output.push(stack.pop())
            }
            for (let i = 0; i < this.options.outputs; i++) {
                stack.push(BigInt(0xdeadbeef));
            }

            return {
                stack,
                output: output,
            };
        }
    }
}

export const SymbolicOpcodes: Record<number, SymbolicOpcode> = {
    0x0: new SymbolicOpcode({
        outputs: 0,
        consumes: 0,
    }),
    0x1: new SymbolicOpcode({
        outputs: 1,
        consumes: 2,
    }),
    0x3: new SymbolicOpcode({
        outputs: 1,
        consumes: 2,
    }),
    0x12: new SymbolicOpcode({
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

            return {
                stack,
                output: null,
            };
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
    0x33: new SymbolicOpcode({
        outputs: 1,
        consumes: 0,
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
    0x54: new SymbolicOpcode({
        outputs: 1,
        consumes: 1,
    }),
    0x55: new SymbolicOpcode({
        outputs: 0,
        consumes: 2,
    }),
    // JUMP
    0x56: new SymbolicOpcode({
        outputs: 0,
        consumes: 1,
    }),
    // JUMPI
    0x57: new SymbolicOpcode({
        outputs: 0,
        consumes: 2,
    }),
    // PUSH
    ...repeatOpcode(0x60, 0x7f, () => new SymbolicOpcode({
        outputs: 1,
        consumes: 0,
        execution: ({ stack, opcode }) => {
            const item = stack;
            const argument = getOpcodeArgument(opcode)
            stack.push(BigInt(`0x${argument}`));

            return {
                stack: item,
                output: null,
            };
        }
    })),
    // DUP
    ...repeatOpcode(0x80, 0x8f, (index) => new SymbolicOpcode({
        outputs: 1,
        consumes: 1,
        execution: ({ stack }) => {
            const item = stack;
            stack.push(stack[stack.length - index]);
            return {
                stack: item,
                output: null,
            };
        }
    })),
    // SWAP
    ...repeatOpcode(0x90, 0x9f, (index) => new SymbolicOpcode({
        outputs: 1,
        consumes: 1,
        execution: ({ stack }) => {
            const item = stack;
            const lastStackItemIndex = stack.length - 1;
            const swapStackItemIndex = lastStackItemIndex - index;
            const first = stack[lastStackItemIndex];
            const second = stack[swapStackItemIndex];

            stack[lastStackItemIndex] = second;
            stack[swapStackItemIndex] = first;

            return {
                stack: item,
                output: null,
            };
        }
    })),
    // LOG
    ...repeatOpcode(0xa0, 0xa4, (index) => new SymbolicOpcode({
        outputs: 0,
        consumes: 1 + index,
        execution: ({stack}) => {
            const logArguments = [...Array(index + 1).fill(0)].map(() => {
                return stack.pop();
            })
            return {
                stack,
                output: logArguments,
            }
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
    execution?: (options: { stack: bigint[]; opcode: ParsedOpcodes }) => {
        stack: bigint[];
        output: null | bigint[]
    }
}
