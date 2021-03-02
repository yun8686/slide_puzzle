import {Panel} from '.';
import PriorityQueue from 'fastpriorityqueue';
export type LogRow = {
  time: number;
  emptyIndex: number;
};

export type ServerPuzzleSet = {
  type: 'ServerPuzzleSet';
  originPanel: Panel;
  moveLogs: LogRow[];
};

export class PuzzleSet {
  private panel: Panel;
  private originPanel: Panel;
  private routes: number[] = []; // suffle時にemptyIndexを記録する(逆順に辿るとゴールできる)
  private moveLogs: LogRow[] = []; // moveTo時にemptyIndexを記録する
  public getPanel = () => this.panel;
  public getRoutes = () => this.routes;
  public popRoutes = () => this.routes.pop();
  public getOriginPanel = () => this.originPanel;
  public getMoveLogs = () => this.moveLogs;

  private currentLogIndex = 0;
  public popMoveLog = () => {
    const currentLogIndex = this.currentLogIndex;
    ++this.currentLogIndex;
    return {
      logRow: this.moveLogs[currentLogIndex],
      waitTime:
        currentLogIndex > 0
          ? this.moveLogs[currentLogIndex].time -
            this.moveLogs[currentLogIndex - 1].time
          : 0,
    };
  };
  public getCurrentLogIndex = () => this.currentLogIndex;

  constructor(panel: Panel);

  constructor(puzzleSet: PuzzleSet);
  constructor(puzzleSet: ServerPuzzleSet, isPlayer: boolean);

  constructor(size: number, suffleTimes: number);

  constructor(
    p: PuzzleSet | ServerPuzzleSet | number | Panel,
    s?: number | boolean,
  ) {
    if (p instanceof PuzzleSet) {
      this.panel = Array.from(p.panel) as Panel;
      this.routes = Array.from(p.routes);
      this.originPanel = p.originPanel;
      this.moveLogs = p.moveLogs;
      this.currentLogIndex = p.currentLogIndex;
    } else if (p instanceof Object && p.type === 'ServerPuzzleSet') {
      const isPlayer = s;
      this.panel = Array.from(p.originPanel) as Panel;
      this.originPanel = Array.from(this.panel) as Panel;
      if (!isPlayer) this.moveLogs = p.moveLogs;
    } else if (p instanceof Array) {
      this.panel = Array.from(p) as Panel;
      this.originPanel = Array.from(this.panel) as Panel;
      this.moveLogs = [];
    } else if (typeof p === 'number' && typeof s === 'number') {
      const suffleTimes = s;
      this.panel = new Array(p * p).fill(0).map((_v, i) => i + 1) as Panel;
      if (suffleTimes) {
        this.suffle(suffleTimes);
      }
      this.originPanel = Array.from(this.panel) as Panel;
      this.moveLogs = [];
    } else {
      console.log('error', 'nonConstructor', {p, s});
      throw 'non constructor';
    }
  }

  suffle(times: number) {
    const emptyNumber = this.panel.length;
    for (let i = 0; i < times; i++) {
      if (this.isWin()) {
        this.routes = [];
      }
      const emptyIndex = this.panel.findIndex((v) => v === emptyNumber);
      this.routes.push(emptyIndex);
      const movableIndexes = this.getMovableIndexes();
      const nextIndex =
        movableIndexes[Math.floor(Math.random() * movableIndexes.length)];
      this.moveTo(nextIndex, true);
    }
  }

  getMovableIndexes() {
    const emptyNumber = this.panel.length;
    const size = Math.sqrt(emptyNumber);
    const emptyIndex = this.panel.findIndex((v) => v === size * size);
    const ans: number[] = [];
    for (let i = 0; i < emptyNumber; i++) {
      if (i === emptyIndex) continue;
      if (i % size === emptyIndex % size) {
        ans.push(i);
      } else if (Math.floor(i / size) === Math.floor(emptyIndex / size)) {
        ans.push(i);
      }
    }
    return ans;
  }
  moveTo(moveToIndex: number, recordLog: boolean) {
    const emptyNumber = this.panel.length;
    const panelSize = Math.sqrt(emptyNumber);
    const emptyIndex = this.panel.findIndex((v) => v === emptyNumber);
    if (moveToIndex === emptyIndex) return;
    const canMoveY = emptyIndex % panelSize === moveToIndex % panelSize;
    const canMoveX =
      Math.floor(emptyIndex / panelSize) ===
      Math.floor(moveToIndex / panelSize);
    if (recordLog && (canMoveX || canMoveY))
      this.moveLogs.push({time: new Date().getTime(), emptyIndex: moveToIndex});
    if (canMoveY) {
      if (moveToIndex > emptyIndex) {
        for (let i = emptyIndex; i < moveToIndex; i += panelSize) {
          [this.panel[i], this.panel[i + panelSize]] = [
            this.panel[i + panelSize],
            this.panel[i],
          ];
        }
      } else {
        for (let i = emptyIndex; i > moveToIndex; i -= panelSize) {
          [this.panel[i], this.panel[i - panelSize]] = [
            this.panel[i - panelSize],
            this.panel[i],
          ];
        }
      }
    } else if (canMoveX) {
      if (moveToIndex > emptyIndex) {
        for (let i = emptyIndex; i < moveToIndex; i += 1) {
          [this.panel[i], this.panel[i + 1]] = [
            this.panel[i + 1],
            this.panel[i],
          ];
        }
      } else {
        for (let i = emptyIndex; i > moveToIndex; i -= 1) {
          [this.panel[i], this.panel[i - 1]] = [
            this.panel[i - 1],
            this.panel[i],
          ];
        }
      }
    }
  }

  clone(): PuzzleSet {
    return new PuzzleSet(this);
  }
  isWin(): boolean {
    if (!this.panel) return false;
    return this.panel.every((v, i) => v === i + 1);
  }
}
