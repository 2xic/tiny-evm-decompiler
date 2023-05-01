import { GetOpcodesInteractor } from "./GetOpcodesInteractor"

describe('GetOpcodesInteractor', () => {
  it('should not be fooled by data', () => {
    const interactor = new GetOpcodesInteractor();
    const response = interactor.getOpcodes({
      contract: Buffer.from('600056010203', 'hex')
    })
    expect(response.map((item) => [item.opcode])).toMatchSnapshot()
  })
});
