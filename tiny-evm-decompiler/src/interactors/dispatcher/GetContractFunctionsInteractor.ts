import BigNumber from "bignumber.js";
import { Address, ExposedEvm, OpcodeMnemonic, Wei, getFreshContainer } from "tinyeth";
import { Evm } from "tinyeth/dist/evm/Evm";

/**
 * Partially based off https://karmacoma.notion.site/Building-an-EVM-from-scratch-part-3-calldata-and-the-function-dispatcher-83e82ea0e02d43cfb60c0cc563729339
 */
export class GetContractFunctionsInteractor {
    public async getFunctions({ contract }: { contract: Buffer }): Promise<Array<{
        value: string;
        location: number
    }>> {
        const selectors = await this.runWithCalldata({
            contract
        });
        return selectors;
    }

    private async runWithCalldata({ contract }: { contract: Buffer }) {
        const evm = getFreshContainer().get(ExposedEvm);

        evm.boot({
            program: contract,
            context: {
                // TODO: this should do "search"
                data: Buffer.from('AA'.repeat(4), 'hex'),
                gasLimit: new BigNumber(2000000),
                nonce: 2,
                receiver: new Address(),
                sender: new Address(),
                value: new Wei(new BigNumber(0)),
            }
        })
        const values: Array<{
            value: string;
            location: number
        }> = [];
        while (evm.isRunning) {
            const opcode = evm.peekOpcode();
            if ([
                OpcodeMnemonic.EQ,
                OpcodeMnemonic.LT,
                OpcodeMnemonic.GT
            ].includes((opcode.opcode.mnemonic) as OpcodeMnemonic)) {
                const size = evm.stack.raw.length;
                const value = evm.stack.raw[size - 1];
                values.push({
                    value: value.toString(16),
                    location: evm.pc,
                });
            }
            await evm.step().catch((err) => {
                // console.log(err);
            });
        }
        return values;
    }
}
