import { EventusPage } from './app.po';

describe('eventus App', function() {
  let page: EventusPage;

  beforeEach(() => {
    page = new EventusPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
