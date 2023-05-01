import 'reflect-metadata'
import { GetCodeBlocksInteractor } from "./interactors/GetCodeBlocksInteractor";
import { GetControlsFlowInteractor, GraphCodeBlocks } from "./interactors/GetControlsFlowInteractor";
import { GetOpcodesInteractor } from "./interactors/GetOpcodesInteractor";
import fs from 'fs';
import { getContractPath } from './helpers/getContractPath';
import { ResolveOrphansInteractor } from './interactors/ResolveOrphansInteractor';
import { GetContractFunctionsInteractor } from './interactors/dispatcher/GetContractFunctionsInteractor';
import {
    BuildCfgInteractor
} from './interactors/BuildCfgInteractor';

const contract = getContractPath(__dirname);
const opcodes = new GetOpcodesInteractor().getOpcodes({
    contract,
})
const contractCodeBlocks = new GetCodeBlocksInteractor().getCodeBlocks(opcodes);

(async () => {
    const functions = await new GetContractFunctionsInteractor().getFunctions({
        contract,
    })
    const { graph } = await new BuildCfgInteractor().build({
        opcodes
    });
    fs.writeFileSync('cfg.json', JSON.stringify({
        graph,
        functions
    }));

    fs.writeFileSync('opcodes.txt', contractCodeBlocks.map((item) => {
        return item.block.map((item) => `0x${item.offset.toString(16)} ${item.opcode.mnemonic} ${item.opcode.arguments}`).join('\n')
    }).join('\n'))
})()
