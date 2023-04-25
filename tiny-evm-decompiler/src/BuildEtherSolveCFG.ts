import 'reflect-metadata'
import { GetCodeBlocksInteractor } from "./interactors/GetCodeBlocksInteractor";
import { GetControlsFlowInteractor, GraphCodeBlocks } from "./interactors/GetControlsFlowInteractor";
import { GetOpcodesInteractor } from "./interactors/GetOpcodesInteractor";
import fs from 'fs';
import { getContractPath } from './helpers/getContractPath';
import { ResolveOrphansInteractor } from './interactors/ResolveOrphansInteractor';
import { GetGraphCodeBlockDispatcher } from './interactors/dispatcher/GetGraphCodeBlockDispatcher';
import { GetContractFunctionsInteractor } from './interactors/dispatcher/GetContractFunctionsInteractor';

const contract = getContractPath(__dirname);
const opcodes = new GetOpcodesInteractor().getOpcodes({
    contract,
})
const contractCodeBlocks = new GetCodeBlocksInteractor().getCodeBlocks(opcodes);
const codeBlocks = new GetControlsFlowInteractor().getControlFlow({
    codeBlocks: contractCodeBlocks
});
const graphBlocks: GraphCodeBlocks[] = new ResolveOrphansInteractor().resolve({
    codeBlocks
}).map((blocks) => {
    return {
        ...blocks,
    }
});

(async () => {
    const { graph } = new GetGraphCodeBlockDispatcher().getDispatcherFlow({
        graph: graphBlocks
    })
    console.log(typeof contract)
    console.log(contract)
    const functions = await new GetContractFunctionsInteractor().getFunctions({
        contract,
    })
    console.log({
        functions
    })

    fs.writeFileSync('cfg.json', JSON.stringify({
        graph,
        functions
    }));
    fs.writeFileSync('opcodes.txt', contractCodeBlocks.map((item) => {
        return item.block.map((item) => `0x${item.offset.toString(16)} ${item.opcode.mnemonic} ${item.opcode.arguments.join(' ')}`).join('\n')
    }).join('\n'))
})()
