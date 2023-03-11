import 'reflect-metadata'
import { MnemonicParser } from "tinyeth/dist/evm/MnemonicParser";
import { GetCodeBlocksInteractor } from "./interactors/GetCodeBlocksInteractor";
import { GetControlsFlowInteractor } from "./interactors/GetControlsFlowInteractor";
import { GetOpcodesInteractor } from "./interactors/GetOpcodesInteractor";
import fs from 'fs';
import path from 'path';

//const contract = '6080604052348015600f57600080fd5b506004361060325760003560e01c806345773e4e14603757806382edd49d146074575b600080fd5b60408051808201909152601181527048656c6c6f20576f726c642c206f6b617960781b60208201525b604051606b91906098565b60405180910390f35b60408051808201909152600981526848656c6c6f2065766d60b81b60208201526060565b600060208083528351808285015260005b8181101560c35785810183015185820160400152820160a9565b8181111560d4576000604083870101525b50601f01601f191692909201604001939250505056fea2646970667358221220a3394a043a48ab6c9e440cc720e5e344ae2b01b480bada3a24807fd2f363c07264736f6c634300080d0033'
// const contract = '6080604052348015600f57600080fd5b506004361060285760003560e01c806312514bba14602d575b600080fd5b603c60383660046076565b603e565b005b60405181815233907f69ca02dd4edd7bf0a4abb9ed3b7af3f14778db5d61921c7dc7cd545266326de29060200160405180910390a250565b600060208284031215608757600080fd5b503591905056fea264697066735822122069fde629581323247d8a4004cb8110511db8008eedae76ad0efb27af7fd3c55464736f6c634300080d0033';

import { parseArgs } from "node:util";

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
const absContractPath = path.join(__dirname, contractPath);
const contract = JSON.parse(fs.readFileSync(absContractPath).toString('utf-8'))["deployedBytecode"]["object"];

const opcodes = new GetOpcodesInteractor().getOpcodes({
    contract,
})
const contractCodeBlcoks = new GetCodeBlocksInteractor().getCodeBlocks(opcodes);

(async () => {
    const results = await new GetControlsFlowInteractor().getControlFlow({
        codeBlocks: contractCodeBlcoks
    })
    fs.writeFileSync('cfg.json', JSON.stringify(results));
    fs.writeFileSync('opcodes.txt', contractCodeBlcoks.map((item) => {
        return item.block.map((item) => `0x${item.offset.toString(16)} ${item.opcode.mnemonic} ${item.opcode.arguments.join(' ')}`).join('\n')
    }).join('\n'))
})()
