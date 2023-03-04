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
      "mnemonic": "PUSH1",
    },
  ],
  [
    {
      "arguments": [],
      "mnemonic": "JUMP",
    },
  ],
  [
    "DATA 0x1",
  ],
  [
    "DATA 0x2",
  ],
  [
    "DATA 0x3",
  ],
]
`);
    })
})
