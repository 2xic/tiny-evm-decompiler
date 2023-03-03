//import { OpCode } from 'tinyeth/dist/evm/OpCode';
import { Opcodes } from 'tinyeth/dist/';
import { OpCode } from 'tinyeth/dist/evm/OpCode';

export class GetOpcodesInteractor {
  public getOpcodes({
    contract
  }: {
    contract: string
  }) {
    let contractBuffer = Buffer.from(contract.replace('0x', ''), 'hex')
    const opcodes: ParsedOpcodes = [];
    let address = 0;
    while (contractBuffer.length) {
      const currentOpcode = contractBuffer[0];
      const opcode = Opcodes[currentOpcode];
      if (!opcode) {
        opcodes.push({
          address,
          opcode: 'INVALID',
          value: currentOpcode,
        });
        contractBuffer = contractBuffer.slice(1);
        address += 1;
      } else {
        const opcodeArguments = contractBuffer.slice(1, opcode.length);
        opcodes.push({
          address: address,
          opcode: {
            mnemonic: opcode.mnemonic,
            arguments: Array.from(opcodeArguments).map((item) => `0x${item.toString(16)}`),
          },
          value: currentOpcode,
        });
        contractBuffer = contractBuffer.slice(!opcode.length ? 1 : opcode.length);
        address += opcode.length;
      }
    }

    return opcodes;
  }
}

export type ParsedOpcodes = Array<{
  address: number,
  opcode: string | {
    mnemonic: string;
    arguments: unknown[];
  };
  value: number;
}>
