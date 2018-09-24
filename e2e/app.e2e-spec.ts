import { TicketToRideFrontendPage } from './app.po';

describe('ticket-to-ride-frontend App', function() {
  let page: TicketToRideFrontendPage;

  beforeEach(() => {
    page = new TicketToRideFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
