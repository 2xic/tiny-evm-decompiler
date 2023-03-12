import { MnemonicParser } from "tinyeth";
import { GetOpcodesInteractor } from "../interactors/GetOpcodesInteractor";
import { SymbolStackExecution } from "./SymbolStackExecution"

describe('SymbolStackExecution', () => {
    it('should correctly execute push', () => {
        const stack = new SymbolStackExecution();
        const mnemonic2Buffer = new MnemonicParser().parse({
            script: 
            `
                PUSH5 0xFFFFFFFFFF
                PUSH5 0
            `
        })
            const opcodes = new GetOpcodesInteractor().getOpcodes({
            contract: mnemonic2Buffer.toString('hex')
        })
        opcodes.forEach((opcode) => {
            stack.executeOpcode({
                opcode,
            })
        })
        expect(stack.raw().map((item) => item.toString(16)).join(',')).toMatchInlineSnapshot(`"ffffffffff,0"`)
    })

    it('should correctly execute dup7', () => {
        const stack = new SymbolStackExecution();
        const mnemonic2Buffer = new MnemonicParser().parse({
            script: 
            `
                // Set state
                PUSH1 1
                PUSH1 0
                PUSH1 0
                PUSH1 0
                PUSH1 0
                PUSH1 0
                PUSH1 0
                
                // Duplicate
                DUP7            
            `
        })
            const opcodes = new GetOpcodesInteractor().getOpcodes({
            contract: mnemonic2Buffer.toString('hex')
        })
        opcodes.forEach((opcode) => {
            stack.executeOpcode({
                opcode,
            })
        })
        expect(stack.raw().map((item) => item.toString(16)).join(',')).toMatchInlineSnapshot(`"1,0,0,0,0,0,0,1"`)
    })

    it('should correctly execute dup', () => {
        const stack = new SymbolStackExecution();
        const mnemonic2Buffer = new MnemonicParser().parse({
            script: 
            `
            // Set state
            PUSH1 1
            PUSH1 0
            PUSH1 0
            PUSH1 0
            PUSH1 0
            PUSH1 0
            PUSH1 0
            PUSH1 0
            PUSH1 0
            PUSH1 0
            PUSH1 0
            PUSH1 0
            PUSH1 0
            PUSH1 0
            PUSH1 0
            
            // Duplicate
            DUP15       
            `
        })
            const opcodes = new GetOpcodesInteractor().getOpcodes({
            contract: mnemonic2Buffer.toString('hex')
        })
        opcodes.forEach((opcode) => {
            stack.executeOpcode({
                opcode,
            })
        })
        expect(stack.raw().map((item) => item.toString(16)).join(',')).toMatchInlineSnapshot(`"1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1"`)
    })


    it('should correctly execute swap10', () => {
        const stack = new SymbolStackExecution();
        const mnemonic2Buffer = new MnemonicParser().parse({
            script: 
            `
                // Set state
                PUSH1 2
                PUSH1 0
                PUSH1 0
                PUSH1 0
                PUSH1 0
                PUSH1 0
                PUSH1 0
                PUSH1 0
                PUSH1 0
                PUSH1 0
                PUSH1 1
                
                // Swap
                SWAP10       
            `
        })
            const opcodes = new GetOpcodesInteractor().getOpcodes({
            contract: mnemonic2Buffer.toString('hex')
        })
        opcodes.forEach((opcode) => {
            stack.executeOpcode({
                opcode,
            })
        })
        expect(stack.raw().map((item) => item.toString(16)).join(',')).toMatchInlineSnapshot(`"1,0,0,0,0,0,0,0,0,0,2"`)
        expect(stack.pop()).toMatchInlineSnapshot(`2n`)
    })


    it('should correctly execute swap2', () => {
        const stack = new SymbolStackExecution();
        const mnemonic2Buffer = new MnemonicParser().parse({
            script: 
            `
            // Set state
            PUSH1 2
            PUSH1 1
            
            // Swap
            SWAP1   
            `
        })
            const opcodes = new GetOpcodesInteractor().getOpcodes({
            contract: mnemonic2Buffer.toString('hex')
        })
        opcodes.forEach((opcode) => {
            stack.executeOpcode({
                opcode,
            })
        })
        expect(stack.raw().map((item) => item.toString(16)).join(',')).toMatchInlineSnapshot(`"1,2"`)
        expect(stack.pop()).toMatchInlineSnapshot(`2n`)
    })

    it('should correctly execute swap3', () => {
        const stack = new SymbolStackExecution();
        const mnemonic2Buffer = new MnemonicParser().parse({
            script: 
            `
            // Set state
            PUSH1 1
            PUSH1 1
            PUSH1 3
            PUSH1 1
            PUSH1 1
            PUSH1 1
            
            // Swap
            swap3   
            `
        })
            const opcodes = new GetOpcodesInteractor().getOpcodes({
            contract: mnemonic2Buffer.toString('hex')
        })
        opcodes.forEach((opcode) => {
            stack.executeOpcode({
                opcode,
            })
        })
        expect(stack.raw().map((item) => item.toString(16)).join(',')).toMatchInlineSnapshot(`"1,1,1,1,1,3"`)
        expect(stack.pop()).toMatchInlineSnapshot(`3n`)
    })
})