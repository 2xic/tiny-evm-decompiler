import { GraphCodeBlocks } from "../GetControlsFlowInteractor";
import { FakeOpcode, RealOpcode } from "../GetOpcodesInteractor";
import { SsaValueRegister } from "./SsaValueRegister";
import { OpcodeMnemonic } from "tinyeth";

/**
 * Reading part of the rattle source code, this looks wrong :) 
 * Will be connecting the pieces and see how bad it is by comparing with rattle output
 * (NOTE that the implementation here is far from finished though, just a poc)
 * 
 * We don't even use PHI nodes currently.
 * 
 * 
 * TODO
 * -> You can adjust the replacement of push by writing the value later on
 * -> This should maybe also make some optimization easier, since you can read the add values also, 
 *      if they are static also then you cna replace them.
 * 
 * PHI
 * -> https://mapping-high-level-constructs-to-llvm-ir.readthedocs.io/en/latest/control-structures/ssa-phi.html
 * -> You can also see how rattle has solved it https://github.com/crytic/rattle/blob/519ab197db5be7bd46dea498056b2f1f6c02e98d/rattle/ssa.py#L179
 *      -> Basically visit the edges and resolve the stack state. 
 *      -> That state is the added as a argument ot the instruction
 * -> There is a nice presentation here also https://www.ics.uci.edu/~yeouln/course/ssa.pdf
 */
export class GetSsaInteractor {
    public getSSA({ graph }: { graph: GraphCodeBlocks[] }): SSABlock[] {
        const ssaValueRegister = new SsaValueRegister();
        const visited: Record<string, undefined | true> = {};
        /**
         * This visit algorithm is bad
         */
        return graph.map((block) => {
            return this.processBlock({ block, ssaValueRegister })
        })
    }

    private processBlock({
        block,
        ssaValueRegister
    }: {
        block: GraphCodeBlocks,
        ssaValueRegister: SsaValueRegister
    }): SSABlock {
        const SSABlock: SSABlock = {
            name: block.name,
            block: []
        };

        const skipOpcodes: string[] = [
            OpcodeMnemonic.JUMPDEST
        ];

        // TODO: This check is VERY simplified, and misclassifies (adds PHI where it does need to be)
        if (1 < block.incoming.length) {
            SSABlock.block.push({
                mnemonic: 'PHI TODO',
                address: 0,
                opcode: null,
            })
        }

        for (const i of block.block) {
            const address = i.offset;
            const opcode = i.opcode;

            if (i.opcode.mnemonic.includes(OpcodeMnemonic.PUSH)) {
                /**
                 * PUSH is actually a direct memory write, I think.
                 * BUT, we could also instead have this in the optimizer ?
                 * TODO: Optimize !!
                 * 
                 * Push 
                 */
                const value = ssaValueRegister.registerValue({
                    value: i.opcode.arguments,
                })
                /*
                SSABlock.block.push({
                    mnemonic: `%${value} ${i.opcode.mnemonic}(${i.opcode.arguments})`,
                    address,
                    opcode,
                })
                */
            } else if (([OpcodeMnemonic.MSTORE] as string[]).includes(i.opcode.mnemonic)) {
                const value = ssaValueRegister.popValue({
                    count: 2,
                })
                SSABlock.block.push({
                    mnemonic: `${i.opcode.mnemonic}(${value})`,
                    address,
                    opcode,
                })
            } else if (([OpcodeMnemonic.AND, OpcodeMnemonic.EQ, OpcodeMnemonic.SHR, OpcodeMnemonic.SHL, OpcodeMnemonic.SUB, OpcodeMnemonic.ADD, OpcodeMnemonic.GT, OpcodeMnemonic.LT] as string[]).includes(i.opcode.mnemonic)) {
                const value = ssaValueRegister.popValue({
                    count: 2,
                })
                const newValue = ssaValueRegister.registerValue()
                SSABlock.block.push({
                    mnemonic: `%${newValue} ${i.opcode.mnemonic}(${value})`,
                    address,
                    opcode,
                })
            } else if (([OpcodeMnemonic.CALLVALUE, OpcodeMnemonic.CALLDATASIZE, OpcodeMnemonic.CALLDATALOAD] as string[]).includes(i.opcode.mnemonic)) {
                const value = ssaValueRegister.registerValue()
                SSABlock.block.push({
                    mnemonic: `%${value} ${i.opcode.mnemonic}`,
                    address,
                    opcode,
                })
            } else if (i.opcode.mnemonic.includes(OpcodeMnemonic.DUP)) {
                /**
                 * DUP Will duplicate the value on the stack, i.e same reference as previous value
                 * -> You should instead have this in the optimizer though, I think.
                 * TODO: move it out to optimizer ? 
                 */
                ssaValueRegister.duplicateValue()
            } else if (([OpcodeMnemonic.ISZERO, OpcodeMnemonic.NOT] as string[]).includes(i.opcode.mnemonic)) {
                const argument = ssaValueRegister.popValue({
                    count: 1,
                })
                const value = ssaValueRegister.registerValue()
                SSABlock.block.push({
                    mnemonic: `%${value} ${i.opcode.mnemonic}(${argument})`,
                    address,
                    opcode,
                })
            } else if (i.opcode.mnemonic.includes(OpcodeMnemonic.JUMPI)) {
                const argument = ssaValueRegister.popValue({
                    count: 2,
                })
                SSABlock.block.push({
                    mnemonic: `${i.opcode.mnemonic}(${argument})`,
                    address,
                    opcode,
                })
            } else if (i.opcode.mnemonic.includes(OpcodeMnemonic.POP)) {
                ssaValueRegister.popValue({
                    count: 1,
                })
            } else if (([OpcodeMnemonic.REVERT, OpcodeMnemonic.RETURN] as string[]).includes(i.opcode.mnemonic)) {
                const argument = ssaValueRegister.popValue({
                    count: 2,
                })
                SSABlock.block.push({
                    mnemonic: `${i.opcode.mnemonic}(${argument})`,
                    address,
                    opcode,
                })
            } else if (([OpcodeMnemonic.JUMP] as string[]).includes(i.opcode.mnemonic)) {
                const argument = ssaValueRegister.popValue({
                    count: 1,
                })
                SSABlock.block.push({
                    mnemonic: `${i.opcode.mnemonic}(${argument})`,
                    address,
                    opcode,
                })
            } else if (i.opcode.mnemonic.includes(OpcodeMnemonic.MLOAD)) {
                const argument = ssaValueRegister.popValue({
                    count: 1,
                })
                const newValue = ssaValueRegister.registerValue();
                SSABlock.block.push({
                    mnemonic: `%${newValue} ${i.opcode.mnemonic}(${argument})`,
                    address,
                    opcode,
                })
            } else if (i.opcode.mnemonic.includes(OpcodeMnemonic.SWAP)) {
                /*
                    TODO
                    -   However it means that stack pointers are moved
                    ->  Meaning values assigned earlier are switched ... ? 
                        -> No, I guess you just change it locally
                    -> Let's try
                */
                /*
                 SSABlock.block.push({
                     mnemonic: `SWAP *TODO*`,
                     address,
                     opcode,
                 })
                 */
                ssaValueRegister.swap((i.opcode.opcode) - 0x90)
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
    block: {
        mnemonic: string;
        address: number;
        opcode: RealOpcode | null;
    }[]
}
