import { parseArgs } from "node:util";
import path from 'path';
import fs from 'fs';

export function getContractPath(dirname: string) {
    const options = {
        contract: {
            type: "string",
            short: "c"
        }
    };
    const {
        values: { contract: contractPath },
    } =
        // @ts-ignore
        parseArgs({ options });


    if (!contractPath || typeof contractPath !== 'string') {
        throw new Error('No contract path');
    }
    const absContractPath = path.join(dirname, contractPath);
    // assumes build from forge
    const contract = JSON.parse(fs.readFileSync(absContractPath).toString('utf-8'))["deployedBytecode"]["object"];
    return contract;
}
