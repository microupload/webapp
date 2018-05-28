import { CryptoModule } from './crypto.module';

describe('CryptoModule', () => {
  let cryptoModule: CryptoModule;

  beforeEach(() => {
    cryptoModule = new CryptoModule();
  });

  it('should create an instance', () => {
    expect(cryptoModule).toBeTruthy();
  });
});
