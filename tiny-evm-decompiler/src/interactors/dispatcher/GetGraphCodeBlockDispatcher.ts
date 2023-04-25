import { CodeBLockProperty } from "../GetCodeBlocksInteractor";
import { GraphCodeBlocks } from "../GetControlsFlowInteractor";

export class GetGraphCodeBlockDispatcher {
    public getDispatcherFlow({ graph }: { graph: GraphCodeBlocks[] }): {
        graph: GraphCodeBlocksDispatcher[],
        endOfDispatcher: number;
    } {
        const orderedBlocks = graph.sort((a, b) => a.startAddress < b.startAddress ? -1 : 1);
        const firstBlock = orderedBlocks.find((item) =>
            item.properties.includes(CodeBLockProperty.STOP) ||
            item.properties.includes(CodeBLockProperty.RETURN)
        )

        return {
            graph: graph.map((item) => {
                return {
                    ...item,
                    isPartOfDispatcher: item.startAddress < firstBlock.startAddress,
                }
            }),
            endOfDispatcher: firstBlock.startAddress,
        }
    }
}

export interface GraphCodeBlocksDispatcher extends GraphCodeBlocks {
    isPartOfDispatcher: boolean;
}
