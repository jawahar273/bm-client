import { PasswordChangeModule } from './password-change.module';

describe('PasswordChangeModule', () => {
  let passwordChangeModule: PasswordChangeModule;

  beforeEach(() => {
    passwordChangeModule = new PasswordChangeModule();
  });

  it('should create an instance', () => {
    expect(passwordChangeModule).toBeTruthy();
  });
});
