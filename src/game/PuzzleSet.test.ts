import jest from 'jest';
import {PuzzleSet, ServerPuzzleSet} from './PuzzleSet';
import {Panel} from '.';
describe('PuzzleSet', () => {
  it('should be suffle', () => {
    const puzzleSet = new PuzzleSet(4, 100);
    puzzleSet.suffle(1000);
    expect(puzzleSet.getPanel()).not.toEqual(new PuzzleSet(4, 0).getPanel());
  });
  it('should be routes reverse', () => {
    for (let i = 0; i < 100; i++) {
      let puzzleSet = new PuzzleSet(4, 100);
      const routes = puzzleSet.getRoutes();
      routes.reverse().forEach((route) => {
        puzzleSet.moveTo(route, true);
        puzzleSet = puzzleSet.clone();
      });
      expect(puzzleSet.getMoveLogs().map((v) => v.emptyIndex)).toEqual(routes);
      expect(puzzleSet.getPanel()).toEqual(new PuzzleSet(4, 0).getPanel());

      let puzzleSet2 = new PuzzleSet(puzzleSet.getOriginPanel());
      puzzleSet
        .getMoveLogs()
        .map((v) => v.emptyIndex)
        .forEach((index) => {
          puzzleSet2.moveTo(index, true);
          puzzleSet2 = puzzleSet2.clone();
        });
    }
  });
  it('should be reverse original panel', () => {
    for (let i = 0; i < 100; i++) {
      let puzzleSet = new PuzzleSet(4, 100);
      const routes = puzzleSet.getRoutes();
      routes.reverse().forEach((route) => {
        puzzleSet.moveTo(route, true);
        puzzleSet = puzzleSet.clone();
      });
      let puzzleSet2 = new PuzzleSet(puzzleSet.getOriginPanel());
      puzzleSet
        .getMoveLogs()
        .map((v) => v.emptyIndex)
        .forEach((index) => {
          puzzleSet2.moveTo(index, false);
          puzzleSet2 = puzzleSet2.clone();
        });
      expect(puzzleSet2.getPanel()).toEqual(new PuzzleSet(4, 0).getPanel());
    }
  });
  it('calc puzzle', () => {
    const list = [
      {
        puzzleSet: {
          originPanel: [1, 2, 3, 4, 5, 6, 16, 8, 9, 10, 7, 12, 13, 14, 11, 15],
          moveLogs: [
            {time: 1614500119512, emptyIndex: 14},
            {time: 1614500119920, emptyIndex: 15},
            {time: 1614500478326, emptyIndex: 10},
            {time: 1614500479344, emptyIndex: 9},
            {time: 1614500479910, emptyIndex: 14},
            {time: 1614500480360, emptyIndex: 13},
            {time: 1614500480568, emptyIndex: 15},
          ],
        },
        user: {deviceId: '', name: 'Pikachu', winrate: 30.01, region: 'US'},
      },
      {
        puzzleSet: {
          originPanel: [1, 2, 7, 3, 5, 16, 6, 4, 9, 10, 11, 8, 13, 14, 15, 12],
          moveLogs: [
            {time: 1614500696116, emptyIndex: 6},
            {time: 1614500696497, emptyIndex: 2},
            {time: 1614500696933, emptyIndex: 4},
            {time: 1614500696950, emptyIndex: 3},
            {time: 1614500697417, emptyIndex: 15},
          ],
        },
        user: {
          deviceId: '164956DE-72FB-41CF-B4E8-BA3F2FFE201C',
          name: 'PekoPokoPakoPoko',
          winrate: 0,
          region: 'US',
          _id: '603b34815e3b36cccd00d63f',
        },
      },
    ];
    list.forEach(({puzzleSet: {originPanel, moveLogs}}) => {
      let puzzleSet2 = new PuzzleSet({
        originPanel,
        moveLogs,
      } as ServerPuzzleSet);
      moveLogs
        .map((v) => v.emptyIndex)
        .forEach((index) => {
          puzzleSet2.moveTo(index, false);
          puzzleSet2 = puzzleSet2.clone();
        });
      expect(puzzleSet2.getPanel()).toEqual(new PuzzleSet(4, 0).getPanel());
    });
  });
});
