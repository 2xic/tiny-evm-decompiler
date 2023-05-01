import { ParsedOpcodes } from "../interactors/GetOpcodesInteractor";

export function getOpcodeArgument(opcode: ParsedOpcodes) {
    const argument = typeof opcode.opcode.arguments !== 'string' ? opcode.opcode.arguments.map((item) => {
        if (!(typeof item === 'string')) {
            throw new Error(`Bad argument type ${item}`)
        }
        return item.slice(2);
    }).join('') :
        opcode.opcode.arguments.slice(2);
    return argument;
}
