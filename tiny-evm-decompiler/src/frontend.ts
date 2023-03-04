//import vis from "vis-network/standalone/umd/vis-network";
import { electronAPI } from "./IpcCommandsInteraface";
import {nodes, edges, options} from './example_data';

const loadButton = document.getElementById('load')
const loadExampleButton = document.getElementById('load_example')
const contract = document.getElementById('contract')

loadButton.addEventListener('click', () => {
    const contractValue = (contract as HTMLTextAreaElement).value;

    console.log(contractValue);
    ((window as any).electronAPI as electronAPI).load(contractValue);
});


loadExampleButton.addEventListener('click', () => {
    ((window as any).electronAPI as electronAPI).loadExample();

    const container = document.getElementById("cfg");
    const data = { nodes: nodes, edges: edges };
    // Ugh, using the npm package caused problems.
    // Loading it from script tag in index-html
    // @ts-ignore
    new vis.Network(
        container,
        data,
        options
    )
});

console.log('yeay2')
