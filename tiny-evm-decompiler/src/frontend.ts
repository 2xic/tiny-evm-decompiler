import { electronAPI } from "./IpcCommandsInteraface";

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
});
