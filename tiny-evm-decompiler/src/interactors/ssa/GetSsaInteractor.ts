import { BlockList } from "net";
import { GraphCodeBlocks } from "../GetControlsFlowInteractor";
import { StackValueRegister } from "./StackValueRegister";
import { OpCode } from "tinyeth/dist/evm/OpCode";
import { OpcodeMnemonic } from "tinyeth";
/**
 * Reading part of the rattle source code, this looks wrong
 * 
 */
export class GetSsaInteractor {
    public getSSA({ graph }: { graph: GraphCodeBlocks[] }): SSABlock[] {
        /**
         * Each push opcode -> Registers an offset
         * Each Read offset -> Decrements it
         */
        return graph.map((block) => {
            return this.processBlock({ block })
        })
    }

    private processBlock({ block }: { block: GraphCodeBlocks }): SSABlock {
        const SSABlock: SSABlock = {
            name: block.name,
            block: []
        }
        const skipOpcodes: string[] = [
            OpcodeMnemonic.JUMPDEST
        ]
        const stackValueRegister = new StackValueRegister();
        for (const i of block.block) {
            if (i.opcode.mnemonic.includes(OpcodeMnemonic.PUSH)) {
                const value = stackValueRegister.registerValue()
                SSABlock.block.push({
                    mnemonic: `%${value} ${i.opcode.mnemonic}(${i.opcode.arguments})`
                })
            } else if (([OpcodeMnemonic.MSTORE] as string[]).includes(i.opcode.mnemonic)) {
                const value = stackValueRegister.popValue({
                    count: 2,
                })
                SSABlock.block.push({
                    mnemonic: `${i.opcode.mnemonic}(${value})`
                })
            } else if (([OpcodeMnemonic.AND, OpcodeMnemonic.EQ, OpcodeMnemonic.SHR, OpcodeMnemonic.SHL, OpcodeMnemonic.SUB, OpcodeMnemonic.ADD, OpcodeMnemonic.GT, OpcodeMnemonic.LT] as string[]).includes(i.opcode.mnemonic)) {
                const value = stackValueRegister.popValue({
                    count: 2,
                })
                const newValue = stackValueRegister.registerValue()
                SSABlock.block.push({
                    mnemonic: `%${newValue} ${i.opcode.mnemonic}(${value})`
                })
            } else if (([OpcodeMnemonic.CALLVALUE, OpcodeMnemonic.CALLDATASIZE, OpcodeMnemonic.CALLDATALOAD] as string[]).includes(i.opcode.mnemonic)) {
                const value = stackValueRegister.registerValue()
                SSABlock.block.push({
                    mnemonic: `%${value} ${i.opcode.mnemonic}`
                })
            } else if (i.opcode.mnemonic.includes(OpcodeMnemonic.DUP)) {
                /**
                 * DUP Will duplicate the value on the stack, i.e same reference as previous value
                 * -> You should instead have this in the optimizer though.
                 * TOOD: move it out to optimizer
                 */
                stackValueRegister.duplicateValue()
            } else if (([OpcodeMnemonic.ISZERO, OpcodeMnemonic.NOT] as string[]).includes(i.opcode.mnemonic)) {
                const argument = stackValueRegister.popValue({
                    count: 1,
                })
                const value = stackValueRegister.registerValue()
                SSABlock.block.push({
                    mnemonic: `%${value} ${i.opcode.mnemonic}(${argument})`
                })
            } else if (i.opcode.mnemonic.includes(OpcodeMnemonic.JUMPI)) {
                const argument = stackValueRegister.popValue({
                    count: 2,
                })
                SSABlock.block.push({
                    mnemonic: `${i.opcode.mnemonic}(${argument})`
                })
            } else if (i.opcode.mnemonic.includes(OpcodeMnemonic.POP)) {
                stackValueRegister.popValue({
                    count: 1,
                })
            } else if (([OpcodeMnemonic.REVERT, OpcodeMnemonic.RETURN] as string[]).includes(i.opcode.mnemonic)) {
                const argument = stackValueRegister.popValue({
                    count: 2,
                })
                SSABlock.block.push({
                    mnemonic: `${i.opcode.mnemonic}(${argument})`
                })
            } else if (([OpcodeMnemonic.JUMP] as string[]).includes(i.opcode.mnemonic)) {
                const argument = stackValueRegister.popValue({
                    count: 1,
                })
                SSABlock.block.push({
                    mnemonic: `${i.opcode.mnemonic}(${argument})`
                })
            } else if (i.opcode.mnemonic.includes(OpcodeMnemonic.MLOAD)) {
                const argument = stackValueRegister.popValue({
                    count: 1,
                })
                const newValue = stackValueRegister.registerValue();
                SSABlock.block.push({
                    mnemonic: `%${newValue} ${i.opcode.mnemonic}(${argument})`
                })
            } else if (i.opcode.mnemonic.includes(OpcodeMnemonic.SWAP)) {
                /*
                    TODO
                    -   However it means that stack pointers are moved
                    ->  Meaning values assigned earlier are switched ... ? 
                        -> No, I guess you just change it locally
                */
                SSABlock.block.push({
                    mnemonic: `SWAP *TODO*`
                })
            } else if (skipOpcodes.includes(i.opcode.mnemonic)) {
                continue;
            } else {
                console.log(`Unknown opcode`)
                console.log(i.opcode);
                break;
            }
        }

        return SSABlock;
    }
}

interface SSABlock {
    name: string;
    block: { mnemonic: string }[]
}
