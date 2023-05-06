import { parseArgs } from "node:util";
import path from 'path';
import fs from 'fs';

export function getContractPath(dirname: string): {
    contract: Buffer,
    output?: string
} {
    const options = {
        contract: {
            type: "string",
            short: "c"
        },
        output: {
            type: "string",
            short: "o",
            default: "cfg.json",
        }
    };
    let {
        values: { contract: contractPath, output },
    } =
        // @ts-ignore
        (parseArgs({ options })) as {
            values: {
                contract?: string;
                output?: string;
            }
        };
    if (!output){
        output = 'cfg.json'
    }


    if (!contractPath || typeof contractPath !== 'string') {
        throw new Error('No contract path');
    } 
    const absContractPath = path.join(dirname, contractPath);
    // assumes build from forge
    const contract = JSON.parse(fs.readFileSync(absContractPath).toString('utf-8'))["deployedBytecode"]["object"].replace('0x', '');
    return {
        contract: Buffer.from(contract, 'hex'),
        output,
    };
}
