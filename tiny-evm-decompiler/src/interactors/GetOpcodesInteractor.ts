//import { OpCode } from 'tinyeth/dist/evm/OpCode';
import { OpcodeLookups, OpcodeMnemonic } from 'tinyeth/dist/';
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
      const opcode: OpCode | undefined = OpcodeLookups[currentOpcode];

      if (opcode?.mnemonic === OpcodeMnemonic.JUMPDEST) {
        isReadingCode = true;
        codeBlockType = CodeBlockType.START;
      }

      if (!opcode) {
        opcodes.push({
          offset: address,
          opcode: {
            mnemonic: `INVALID`,
            arguments: [],
            isReal: false,
          },
          codeBlockType: CodeBlockType.INVALID,
          value: currentOpcode,
        });
        contractBuffer = contractBuffer.slice(1);
        address += 1;
      } else if (!isReadingCode) {
        opcodes.push({
          offset: address,
          opcode: {
            mnemonic: `DATA`,
            arguments: [`0x${currentOpcode.toString(16)}`],
            isReal: false,
          },
          codeBlockType: CodeBlockType.DATA,
          value: currentOpcode,
        });
        contractBuffer = contractBuffer.slice(1);
        address += 1;
      } else {
        if (opcode.isTerminating) {
          isReadingCode = false;
          codeBlockType = CodeBlockType.END
        } else if (opcode.mnemonic === OpcodeMnemonic.JUMPI) {
          codeBlockType = CodeBlockType.END
        }

        const opcodeArguments = contractBuffer.slice(1, opcode.length);
        opcodes.push({
          offset: address,
          opcode: {
            mnemonic: opcode.mnemonic,
            arguments: Array.from(opcodeArguments).map((item) => `0x${item.toString(16)}`),
            isReal: true,
          },
          value: currentOpcode,
          codeBlockType,
        });
        contractBuffer = contractBuffer.slice(opcode.length);
        address += opcode.length;
      }

      codeBlockType = undefined;
    }

    return opcodes;
  }
}

export type ParsedOpcodes = {
  offset: number,
  opcode: FakeOpcode | RealOpcode;
  value: number;
  codeBlockType?: CodeBlockType,
}

export interface FakeOpcode {
  mnemonic: string;
  arguments: unknown[];
  isReal: boolean;
}

export interface RealOpcode {
  mnemonic: string;
  arguments: unknown[];
  isReal: boolean;
}

export enum CodeBlockType {
  'START' = 'START',
  'END' = 'END',
  'DATA' = 'DATA',
  'INVALID' = 'INVALID',
};
