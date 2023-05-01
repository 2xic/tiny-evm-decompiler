import 'reflect-metadata'
import { GetCodeBlocksInteractor } from "./interactors/GetCodeBlocksInteractor";
import { GetControlsFlowInteractor, GraphCodeBlocks } from "./interactors/GetControlsFlowInteractor";
import { GetOpcodesInteractor } from "./interactors/GetOpcodesInteractor";
import fs from 'fs';
import { getContractPath } from './helpers/getContractPath';
import { ResolveOrphansInteractor } from './interactors/ResolveOrphansInteractor';
import { GetGraphCodeBlockDispatcher } from './interactors/dispatcher/GetGraphCodeBlockDispatcher';
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
    const { graph } = new GetGraphCodeBlockDispatcher().getDispatcherFlow({
        graph: graphBlocks
    })
    const results = new GetSsaInteractor().getSSA({
        graph: graphBlocks
    });
    const connectedGraphs = results.map((item) => {
        const graphEdges = graph.find((item2) => {
            return item2.name == item.name
        })
        return {
            ...item,
            calls: graphEdges.calls,
            endAddress: graphEdges.endAddress,
        }
    })
    fs.writeFileSync('ssa.json', JSON.stringify(connectedGraphs));
})()
