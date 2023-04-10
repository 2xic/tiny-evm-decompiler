import { OpcodeMnemonic } from "tinyeth";
import { CodeBlockType, ParsedOpcodes } from "./GetOpcodesInteractor";

export class GetCodeBlocksInteractor {
    public getCodeBlocks(opcodes: ParsedOpcodes[]): CodeBlocks[] {
        const blocks: ParsedOpcodes[][] = [];
        let block: ParsedOpcodes[] = [];
        for (var i = 0; i < opcodes.length; i++) {
            const opcode = opcodes[i];

            if ([CodeBlockType.END, CodeBlockType.DATA].includes(opcode.codeBlockType)) {
                if (opcode.codeBlockType === CodeBlockType.DATA) {
                    if (block.length) {
                        if (![CodeBlockType.DATA, CodeBlockType.INVALID].includes(block[block.length - 1].codeBlockType)){
                            blocks.push([...block]);
                            block = [
                                opcode
                            ];
                        } else {
                            block.push(opcode);
                        }
                    }
                } else {
                    block.push(opcode);
                    blocks.push([...block]);
                    block = [];
                }
            } else if (opcode.codeBlockType === CodeBlockType.START){
                if (block.length){
                    blocks.push([...block]);
                    block = [opcode];
                } else{
                    block.push(opcode)
                }
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
            const properties: Set<CodeBLockProperty> = new Set<CodeBLockProperty>();
            item.find((item) =>{
                if (item.opcode.mnemonic.includes(OpcodeMnemonic.LOG)){
                    properties.add(CodeBLockProperty.LOG)
                } else if (item.opcode.mnemonic.includes(OpcodeMnemonic.JUMPDEST)){
                    properties.add(CodeBLockProperty.JUMPDEST)
                } else if (item.opcode.mnemonic.includes(OpcodeMnemonic.RETURN)){
                    properties.add(CodeBLockProperty.RETURN)
                } else if (item.opcode.mnemonic.includes(OpcodeMnemonic.STOP)){
                    properties.add(CodeBLockProperty.STOP)
                }
            })

            return {
                name: start.toString(16),
                startAddress: start,
                endAddress: end,
                block: item,
                properties: [...properties],
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
    properties: CodeBLockProperty[]
}

export enum CodeBLockProperty {
    'LOG' = 'LOG',
    'JUMPDEST' = 'JUMPDEST',
    'RETURN' = 'RETURN',
    'STOP' = 'STOP'
}
