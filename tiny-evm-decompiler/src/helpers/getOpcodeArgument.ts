import { ParsedOpcodes } from "../interactors/GetOpcodesInteractor";

export function getOpcodeArgument(opcode: ParsedOpcodes) {
    const argument = opcode.opcode.arguments.slice(2);
    return argument;
}
