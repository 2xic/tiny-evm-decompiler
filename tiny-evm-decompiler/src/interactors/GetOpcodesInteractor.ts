//import { OpCode } from 'tinyeth/dist/evm/OpCode';
import { Opcodes } from 'tinyeth/dist/';
import { OpCode } from 'tinyeth/dist/evm/OpCode';

export class GetOpcodesInteractor {
  public getOpcodes({
    contract
  }: {
    contract: string
  }): ParsedOpcodes[] {
    let contractBuffer = Buffer.from(contract.replace('0x', ''), 'hex')
    const opcodes: ParsedOpcodes[] = [];
    let address = 0;
    let isReadingCode = true;
    let codeBlockType = CodeBlockType.START;

    while (contractBuffer.length) {
      const currentOpcode = contractBuffer[0];
      const opcode: OpCode | undefined = Opcodes[currentOpcode];

      if (opcode?.mnemonic === 'JUMPDEST'){
        isReadingCode = true;
        codeBlockType = CodeBlockType.START;
      }

      if (!opcode) {
        opcodes.push({
          address,
          opcode: 'INVALID',
          value: currentOpcode,
        });
        contractBuffer = contractBuffer.slice(1);
        address += 1;
      } else if (!isReadingCode){
        opcodes.push({
          address,
          opcode: `DATA 0x${currentOpcode.toString(16)}`,
          value: currentOpcode,
        });
        contractBuffer = contractBuffer.slice(1);
      } else {
        if (opcode.isTerminating){
          isReadingCode = false;
          codeBlockType = CodeBlockType.END
        }
        const opcodeArguments = contractBuffer.slice(1, opcode.length);
        opcodes.push({
          address: address,
          opcode: {
            mnemonic: opcode.mnemonic,
            arguments: Array.from(opcodeArguments).map((item) => `0x${item.toString(16)}`),
          },
          value: currentOpcode,
          codeBlockType,
        });
        contractBuffer = contractBuffer.slice(!opcode.length ? 1 : opcode.length);
        address += opcode.length;
      }

      codeBlockType = undefined;
    }

    return opcodes;
  }
}

export type ParsedOpcodes = {
  address: number,
  opcode: string | {
    mnemonic: string;
    arguments: unknown[];
  };
  value: number;
  codeBlockType?: CodeBlockType,
}

export enum CodeBlockType {
  'START',
  'END'
};
