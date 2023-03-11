import 'reflect-metadata'
import { GetCodeBlocksInteractor } from "./interactors/GetCodeBlocksInteractor";
import { GetControlsFlowInteractor } from "./interactors/GetControlsFlowInteractor";
import { GetOpcodesInteractor } from "./interactors/GetOpcodesInteractor";
import fs from 'fs';
import { getContractPath } from './helpers/getContractPath';
const contract = getContractPath(__dirname);
const opcodes = new GetOpcodesInteractor().getOpcodes({
    contract,
})
const contractCodeBlcoks = new GetCodeBlocksInteractor().getCodeBlocks(opcodes);

(async () => {
    const results = await new GetControlsFlowInteractor().getControlFlow({
        codeBlocks: contractCodeBlcoks
    })
    fs.writeFileSync('cfg.json', JSON.stringify(results));
    fs.writeFileSync('opcodes.txt', contractCodeBlcoks.map((item) => {
        return item.block.map((item) => `0x${item.offset.toString(16)} ${item.opcode.mnemonic} ${item.opcode.arguments.join(' ')}`).join('\n')
    }).join('\n'))
})()
