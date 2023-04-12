import 'reflect-metadata'
import { GetCodeBlocksInteractor } from "./interactors/GetCodeBlocksInteractor";
import { GetControlsFlowInteractor, GraphCodeBlocks } from "./interactors/GetControlsFlowInteractor";
import { GetOpcodesInteractor } from "./interactors/GetOpcodesInteractor";
import fs from 'fs';
import { getContractPath } from './helpers/getContractPath';
import { ResolveOrphansInteractor } from './interactors/ResolveOrphansInteractor';
import { GetGraphCodeBlockDispatcher } from './interactors/GetGraphCodeBlockDispatcher';
import { GetSsaInteractor } from './interactors/ssa/GetSsaInteractor';

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
    const results = new GetSsaInteractor().getSSA({
        graph: graphBlocks
    })
    fs.writeFileSync('ssa.json', JSON.stringify(results));
})()
