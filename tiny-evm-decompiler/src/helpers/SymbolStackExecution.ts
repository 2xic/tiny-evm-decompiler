import BigNumber from "bignumber.js";
import { ParsedOpcodes } from "../interactors/GetOpcodesInteractor";
import { SymbolicOpcodes } from "./SymbolicOpcodes";

export class SymbolStackExecution {
    constructor(
        private stack: bigint[] = []
    ){

    }

    public executeOpcode({ opcode }: { opcode: ParsedOpcodes }) {
        const numericOpcode = opcode.opcode.opcode;

        if (SymbolicOpcodes[numericOpcode]) {
            const newStack = SymbolicOpcodes[numericOpcode].execute({
                stack: this.stack,
                opcode,
            })
            if (newStack.includes(undefined)) {
                throw new Error(`Found undefined on stack, last item was ${opcode.opcode.mnemonic} (${opcode.opcode.opcode.toString(16)})`)
            }
            this.stack = newStack
        } else {
            throw new Error(`Missing opcode 0x${numericOpcode.toString(16)}`);
        }
    }

    public clone(){
        return new SymbolStackExecution([...this.raw()])
    }

    public peek(): bigint {
        return this.stack[this.stack.length - 1];
    }

    public pop() {
        this.stack.pop();
    }

    public raw(){
        return this.stack;
    }
}
