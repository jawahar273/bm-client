import { ConfirmEmailModule } from './confirm-email.module';

describe('ConfirmEmailModule', () => {
  let confirmEmailModule: ConfirmEmailModule;

  beforeEach(() => {
    confirmEmailModule = new ConfirmEmailModule();
  });

  it('should create an instance', () => {
    expect(confirmEmailModule).toBeTruthy();
  });
});
