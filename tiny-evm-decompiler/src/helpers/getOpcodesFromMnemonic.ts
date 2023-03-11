import { MnemonicParser } from "tinyeth";
import { CodeBlocks } from "../interactors/GetCodeBlocksInteractor";
import { Logger } from "./Logger";

export function getCodeBlock({codeblock}: {codeblock: CodeBlocks}){
    const logger = new Logger();
    logger.log('');
    const code = (codeblock.block.filter((item) => {
        return item.opcode.isReal;
    }).map((item) => {
        logger.log(
            `0x${item.offset.toString(16)} ${item.opcode.mnemonic} ${item.opcode.arguments.join(' ')}`
        )
        return `${item.opcode.mnemonic} ${item.opcode.arguments.join(' ')}`
    }))
    
    const mnemonic2Buffer = new MnemonicParser().parse({
        script: code.join('\n')
    })
    return mnemonic2Buffer;
}
