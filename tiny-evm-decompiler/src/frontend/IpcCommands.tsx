import { contextBridge, ipcRenderer } from 'electron';
import { CodeBlocks } from '../interactors/GetCodeBlocksInteractor';
import { ParsedOpcodes } from '../interactors/GetOpcodesInteractor';
import { electronAPI } from './IpcCommandsInteraface';
import { GraphCodeBlocks } from '../interactors/GetControlsFlowInteractor';
import { CreateVizEdge, CreateVizNode, options } from '../helpers/CreateVizNode';
import vis from './vis.min.js';

contextBridge.exposeInMainWorld("require", require);

contextBridge.exposeInMainWorld('electronAPI', {
    load: (contract: string) => {
        ipcRenderer.send('load', contract);
    },
    loadExample: () => {
        ipcRenderer.send('load_example')
    }
} as electronAPI)

ipcRenderer.on('contractOpcodes', (_, data) => {
    const opcodes = document.getElementById('opcodes')
    const response: ParsedOpcodes[] = JSON.parse(data)
    response.forEach((entry) => {
        const row = document.createElement("tr");

        const address = document.createElement("td");
        address.innerHTML = entry.offset.toString(16);
        address.id = entry.offset.toString(16);

        const opcode = document.createElement("td");
        opcode.innerHTML = entry.opcode.mnemonic;

        const opcode_arguments = document.createElement("td");
        opcode_arguments.innerHTML = entry.opcode.arguments.join(' ');

        row.appendChild(address);
        row.appendChild(opcode);
        row.appendChild(opcode_arguments)

        opcodes.appendChild(row);

    })
    /*
    const root = ReactDOM.createRoot(
        document.getElementById('mynetwork') as HTMLElement
      );
      root.render(
        <React.Fragment>
          yooo
        </React.Fragment>
      );      
    */
})

ipcRenderer.on('contractCodeBlocks', (_, rawResponse) => {
    const opcodes = document.getElementById('jumps')
    const response: CodeBlocks[] = JSON.parse(rawResponse);
    response.forEach((entry) => {
        const row = document.createElement("tr");

        const address = document.createElement("td");
        address.innerHTML = entry.startAddress.toString(16);

        const jump_name = document.createElement("td");
        jump_name.innerHTML = entry.name;

        row.appendChild(address);
        row.appendChild(jump_name)

        row.addEventListener('click', (() => {
            document.getElementById(entry.startAddress.toString(16)).scrollIntoView()
        }))

        opcodes.appendChild(row);
    })
})

ipcRenderer.on('contractGraphBlocks', (_, rawResponse) => {
    const response: GraphCodeBlocks[] = JSON.parse(rawResponse);

    const nodes = [];
    const edges = [];
    response.forEach((item) => {
        const nodeId = item.startAddress.toString(16);
        nodes.push(CreateVizNode({
            id: nodeId,
            code: item.block.map((item) => {
                return `0x${item.offset.toString(16)} ${item.opcode.mnemonic} ${item.opcode.arguments.join(' ')}`
            }).join('\n')
        }));
        item.calls.forEach((id) => {
            edges.push(CreateVizEdge({
                from: nodeId,
                to: id,
            }))
        })
    })
    const container = document.getElementById("cfg");
    const data = { nodes, edges };
    // Ugh, using the npm package caused problems.
    // Loading it from script tag in index-html
    const network = new vis.Network(
        container,
        data,
        options
    );
    network.stabilize();

    network.on("afterDrawing", function(ctx) {
        var dataURL = ctx.canvas.toDataURL();
        (document.getElementById('canvasImg') as HTMLAnchorElement).href = dataURL;
    })
})
