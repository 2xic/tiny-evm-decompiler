import 'reflect-metadata'
import { GetCodeBlocksInteractor } from "./interactors/GetCodeBlocksInteractor";
import { GetOpcodesInteractor } from "./interactors/GetOpcodesInteractor";
import { GetLogTopicsInteractor } from './interactors/GetLogTopicsInteractor';
import { getContractPath } from './helpers/getContractPath';

const {contract} = getContractPath(__dirname);
const opcodes = new GetOpcodesInteractor().getOpcodes({
  contract,
})
const contractCodeBlocks = new GetCodeBlocksInteractor().getCodeBlocks(opcodes);

(async () => {
  const response = await new GetLogTopicsInteractor().getLogTopics({
    codeBlocks: contractCodeBlocks,
  })
  console.log(JSON.stringify(response))
})()
