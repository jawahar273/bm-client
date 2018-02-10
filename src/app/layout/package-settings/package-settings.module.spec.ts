import { PackageSettingsModule } from './package-settings.module';

describe('PackageSettingsModule', () => {
  let packageSettingsModule: PackageSettingsModule;

  beforeEach(() => {
    packageSettingsModule = new PackageSettingsModule();
  });

  it('should create an instance', () => {
    expect(packageSettingsModule).toBeTruthy();
  });
});
