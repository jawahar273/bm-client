import { PluralizationPipe } from './pluralization.pipe';

describe('PluralizationPipe', () => {
  it('create an instance', () => {
    const pipe = new PluralizationPipe();
    expect(pipe).toBeTruthy();
  });
});
