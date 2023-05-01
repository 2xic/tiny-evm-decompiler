import { GetCodeBlocksInteractor } from "./GetCodeBlocksInteractor";
import { GetControlsFlowInteractor, GraphCodeBlocks } from "./GetControlsFlowInteractor";
import { ParsedOpcodes } from "./GetOpcodesInteractor";
import { ResolveOrphansInteractor } from "./ResolveOrphansInteractor";
import { GetGraphCodeBlockDispatcher } from './dispatcher/GetGraphCodeBlockDispatcher';
import { GetContractFunctionsInteractor } from './dispatcher/GetContractFunctionsInteractor';

export class BuildCfgInteractor {
    public async build({opcodes}: {opcodes: ParsedOpcodes[]}) {
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
        const { graph } = new GetGraphCodeBlockDispatcher().getDispatcherFlow({
            graph: graphBlocks
        })
        
        return {
            graph
        }
    }
}