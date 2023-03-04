import { CodeBlockType, ParsedOpcodes } from "./GetOpcodesInteractor";

export class GetCodeBlocksInteractor {
    public getCodeBlocks(opcodes: ParsedOpcodes[]): CodeBlocks[] {
        const blocks: ParsedOpcodes[][] = [];
        let block: ParsedOpcodes[] = [];
        for(var i = 0; i < opcodes.length; i++){
            if (opcodes[i].codeBlockType === CodeBlockType.END){
                blocks.push([...block, opcodes[i]]);
                block = []
            } else {
                block.push(opcodes[i])
            }
        }
        return blocks.map((item): CodeBlocks => {
            const start = item[0].address;
            const end = item[item.length - 1].address
            return {
                name: start.toString(16),
                startAddress: start,
                endAddress: end,
            }
        });
    }    
}

export interface CodeBlocks {
    name: string;
    startAddress: number;
    endAddress: number;
}
