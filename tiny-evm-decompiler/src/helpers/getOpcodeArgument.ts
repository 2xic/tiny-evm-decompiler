import { ParsedOpcodes } from "../interactors/GetOpcodesInteractor";

export function getOpcodeArgument(opcode: ParsedOpcodes){
    const argument = opcode.opcode.arguments.map((item) => {
        if (!(typeof item === 'string')) {
            throw new Error(`Bad argument type ${item}`)
        }
        return item.slice(2);
    }).join('')
    return argument;
}
