import { ParsedOpcodes } from "./GetOpcodesInteractor";

export class GetJumpDesitions{
    public getJumpDestinations(opcodes: ParsedOpcodes): JumpDestinations[] {
        return opcodes.filter((item) => {
            return item.value === 0x5b; 
        }).map((item) => {
            return {
                name: `0x${item.address}`,
                address: item.address
            }
        })
    }    
}

export interface JumpDestinations {
    name: string;
    address: number;
}
