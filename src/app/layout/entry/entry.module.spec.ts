import { EntryModule } from './entry.module';
import { PageHeaderModule } from '../../shared';
// import { ListedItemsModule } from './listed-items/listed-items.module';

describe('EntryModule', () => {
    let entryModule: EntryModule;
    // let listedItemsModule: ListedItemsModule;
    let pageHeaderModule: PageHeaderModule;

    beforeEach(() => {
        entryModule = new EntryModule();
        // listedItemsModule = new ListedItemsModule();
        pageHeaderModule = new PageHeaderModule();
    });

    it('should create an instance', () => {
        expect(entryModule).toBeTruthy();
        // expect(listedItemsModule).toBeTruthy();
        expect(pageHeaderModule).toBeTruthy();
        
    });
});
