import { contextBridge, ipcRenderer } from 'electron';
import { JumpDestinations } from './interactors/GetJumpDestinations';
import { ParsedOpcodes } from './interactors/GetOpcodesInteractor';
import { electronAPI } from './IpcCommandsInteraface';

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
    const response: ParsedOpcodes = JSON.parse(data)
    response.forEach((entry) => {
        const row = document.createElement("tr");

        const address = document.createElement("td");
        address.innerHTML = entry.address.toString(16);
        address.id = entry.address.toString(16);

        const opcode = document.createElement("td");
        opcode.innerHTML = typeof entry.opcode === 'string' ? entry.opcode : entry.opcode.mnemonic;

        const opcode_arguments = document.createElement("td");
        opcode_arguments.innerHTML = typeof entry.opcode === 'string' ? '' : entry.opcode.arguments.join(' ');

        row.appendChild(address);
        row.appendChild(opcode);
        row.appendChild(opcode_arguments)

        opcodes.appendChild(row);
    })
})

ipcRenderer.on('jumpDestinations', (_, data) => {
    const opcodes = document.getElementById('jumps')
    const response: JumpDestinations[] = JSON.parse(data)
    response.forEach((entry) => {
        const row = document.createElement("tr");

        const address = document.createElement("td");
        address.innerHTML = entry.address.toString(16);

        const jump_name = document.createElement("td");
        jump_name.innerHTML = entry.name;

        row.appendChild(address);
        row.appendChild(jump_name)

        row.addEventListener('click', (() => {
            document.getElementById(entry.address.toString(16)).scrollIntoView()
        }))

        opcodes.appendChild(row);
    })
})
