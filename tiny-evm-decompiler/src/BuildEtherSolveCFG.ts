import 'reflect-metadata'
import { GetCodeBlocksInteractor } from "./interactors/GetCodeBlocksInteractor";
import { GetControlsFlowInteractor } from "./interactors/GetControlsFlowInteractor";
import { GetOpcodesInteractor } from "./interactors/GetOpcodesInteractor";
import fs from 'fs';
import { getContractPath } from './helpers/getContractPath';
import { ResolveOrphansInteractor } from './interactors/ResolveOrphansInteractor';

const contract = getContractPath(__dirname);
const opcodes = new GetOpcodesInteractor().getOpcodes({
    contract,
})
const contractCodeBlocks = new GetCodeBlocksInteractor().getCodeBlocks(opcodes);

(async () => {
    const codeBlocks = await new GetControlsFlowInteractor().getControlFlow({
        codeBlocks: contractCodeBlocks
    });
    const results = new ResolveOrphansInteractor().resolve({
        codeBlocks
    }).map((blocks) => {
        return {
            ...blocks,
        }
    })
    fs.writeFileSync('cfg.json', JSON.stringify(results));
    fs.writeFileSync('opcodes.txt', contractCodeBlocks.map((item) => {
        return item.block.map((item) => `0x${item.offset.toString(16)} ${item.opcode.mnemonic} ${item.opcode.arguments.join(' ')}`).join('\n')
    }).join('\n'))
})()
