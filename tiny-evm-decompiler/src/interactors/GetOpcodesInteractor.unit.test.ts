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
      "opcode": 96,
    },
  ],
  [
    {
      "arguments": [],
      "isReal": true,
      "mnemonic": "JUMP",
      "opcode": 86,
    },
  ],
  [
    {
      "arguments": [
        "0x1",
      ],
      "isReal": false,
      "mnemonic": "DATA",
      "opcode": 1,
    },
  ],
  [
    {
      "arguments": [
        "0x2",
      ],
      "isReal": false,
      "mnemonic": "DATA",
      "opcode": 2,
    },
  ],
  [
    {
      "arguments": [
        "0x3",
      ],
      "isReal": false,
      "mnemonic": "DATA",
      "opcode": 3,
    },
  ],
]
`);
    })
})
