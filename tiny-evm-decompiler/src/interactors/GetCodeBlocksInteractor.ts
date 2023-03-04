import { OpCode } from "tinyeth/dist/evm/OpCode";
import { CodeBlockType, ParsedOpcodes } from "./GetOpcodesInteractor";

export class GetCodeBlocksInteractor {
    public getCodeBlocks(opcodes: ParsedOpcodes[]): CodeBlocks[] {
        const blocks: ParsedOpcodes[][] = [];
        let block: ParsedOpcodes[] = [];
        for (var i = 0; i < opcodes.length; i++) {
            const opcode = opcodes[i];
            if (opcode.codeBlockType === CodeBlockType.END) {
                block.push(opcode);
                blocks.push([...block]);
              //  console.log(block);
                block = [];
            } else {
                block.push(opcode)
            }
        }

        if (block.length) {
            blocks.push(block);
        }

        const merged = blocks.map((item): CodeBlocks => {
            const start = item[0].offset;
            const end = item[item.length - 1].offset + 1;
            return {
                name: start.toString(16),
                startAddress: start,
                endAddress: end,
                block: item,
            };
        });

        return merged;
    }
}

export interface CodeBlocks {
    name: string;
    startAddress: number;
    endAddress: number;
    block: ParsedOpcodes[];
}
