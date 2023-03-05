import { GetOpcodesInteractor } from "./GetOpcodesInteractor"

describe('GetOpcodesInteractor', () => {
    it('should not be fooled by data', () => {
        const interactor = new GetOpcodesInteractor();
        const response = interactor.getOpcodes({
            contract: '600056010203'
        })      
        expect(response.map((item) => [item.opcode])).toMatchInlineSnapshot(`
[
  [
    {
      "arguments": [
        "0x0",
      ],
      "isReal": true,
      "mnemonic": "PUSH1",
    },
  ],
  [
    {
      "arguments": [],
      "isReal": true,
      "mnemonic": "JUMP",
    },
  ],
  [
    {
      "arguments": [
        "0x1",
      ],
      "isReal": false,
      "mnemonic": "DATA",
    },
  ],
  [
    {
      "arguments": [
        "0x2",
      ],
      "isReal": false,
      "mnemonic": "DATA",
    },
  ],
  [
    {
      "arguments": [
        "0x3",
      ],
      "isReal": false,
      "mnemonic": "DATA",
    },
  ],
]
`);
    })
})
