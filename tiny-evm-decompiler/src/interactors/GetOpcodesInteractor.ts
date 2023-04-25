import { OpcodeLookups, OpcodeMnemonic } from 'tinyeth/dist/';
import { OpCode } from 'tinyeth/dist/evm/OpCode';

export class GetOpcodesInteractor {
  public getOpcodes({
    contract
  }: {
    contract: Buffer
  }): ParsedOpcodes[] {
    const opcodes: ParsedOpcodes[] = [];
    let address = 0;
    let isReadingCode = true;
    let codeBlockType = CodeBlockType.START;

    while (contract.length) {
      const currentOpcode = contract[0];
      const opcode: OpCode | undefined = OpcodeLookups[currentOpcode];

      if (opcode?.mnemonic === OpcodeMnemonic.JUMPDEST) {
        isReadingCode = true;
        codeBlockType = CodeBlockType.START;
      }

      if (!opcode) {
        opcodes.push({
          offset: address,
          opcode: {
            opcode: currentOpcode,
            mnemonic: `INVALID`,
            arguments: [],
            isReal: false,
          },
          codeBlockType: CodeBlockType.INVALID,
          value: currentOpcode,
        });
        contract = contract.slice(1);
        address += 1;
      } else if (!isReadingCode) {
        opcodes.push({
          offset: address,
          opcode: {
            opcode: currentOpcode,
            mnemonic: `DATA`,
            arguments: [`0x${currentOpcode.toString(16)}`],
            isReal: false,
          },
          codeBlockType: CodeBlockType.DATA,
          value: currentOpcode,
        });
        contract = contract.slice(1);
        address += 1;
      } else {
        if (opcode.isTerminating) {
          isReadingCode = false;
          codeBlockType = CodeBlockType.END
        } else if (opcode.mnemonic === OpcodeMnemonic.JUMPI) {
          codeBlockType = CodeBlockType.END
        }

        const opcodeArguments = contract.slice(1, opcode.length);
        opcodes.push({
          offset: address,
          opcode: {
            opcode: currentOpcode,
            mnemonic: opcode.mnemonic,
            arguments: Array.from(opcodeArguments).map((item) => `0x${item.toString(16)}`),
            isReal: true,
          },
          value: currentOpcode,
          codeBlockType,
        });
        contract = contract.slice(opcode.length);
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
  opcode: number;
  isReal: boolean;
}

export interface RealOpcode {
  mnemonic: string;
  opcode: number;
  arguments: unknown[];
  isReal: boolean;
}

export enum CodeBlockType {
  'START' = 'START',
  'END' = 'END',
  'DATA' = 'DATA',
  'INVALID' = 'INVALID',
};
