import { MicroUploadModule } from './micro-upload.module';

describe('MicroUploadModule', () => {
  let microUploadModule: MicroUploadModule;

  beforeEach(() => {
    microUploadModule = new MicroUploadModule();
  });

  it('should create an instance', () => {
    expect(microUploadModule).toBeTruthy();
  });
});
