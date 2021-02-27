import jest from 'jest';
import {PanelSet} from './PanelSet';
import {Panel} from '.';
describe('PanelSet', () => {
  it('should be suffle', () => {
    const panelSet = new PanelSet(4, 100);
    panelSet.suffle(1000);
    expect(panelSet.getPanel()).not.toEqual(new PanelSet(4, 0).getPanel());
  });
  it('should be routes reverse', () => {
    for (let i = 0; i < 100; i++) {
      let panelSet = new PanelSet(4, 100);
      const routes = panelSet.getRoutes();
      routes.reverse().forEach((route) => {
        panelSet.moveTo(route);
        panelSet = panelSet.clone();
      });
      expect(panelSet.getMoveLogs().map((v) => v.emptyIndex)).toEqual(routes);
      expect(panelSet.getPanel()).toEqual(new PanelSet(4, 0).getPanel());
    }
  });
});
