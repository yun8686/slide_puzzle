import {Panel} from '.';
import PriorityQueue from 'fastpriorityqueue';
import {ImageId} from '../../slide_puzzle_api/src/models/image';
export type LogRow = {
  time: number;
  emptyIndex: number;
};

export type ServerPuzzleSet = {
  type: 'ServerPuzzleSet';
  imageId: ImageId;
  originPanel: Panel;
  moveLogs: LogRow[];
};

type PuzzleSetConstructor =
  | PanelConstructor
  | CloneConstructor
  | ServerPuzzleSetConstructor
  | GenerateConstructor;
type PanelConstructor = {
  type: 'PanelConstructor';
  panel: Panel;
  imageId: ImageId;
};
type CloneConstructor = {type: 'CloneConstructor'; puzzleSet: PuzzleSet};
type ServerPuzzleSetConstructor = {
  type: 'ServerPuzzleSetConstructor';
  puzzleSet: ServerPuzzleSet;
  isPlayer: boolean;
};
type GenerateConstructor = {
  type: 'GenerateConstructor';
  size: number;
  suffleTimes: number;
  imageId: ImageId;
};
export class PuzzleSet {
  private panel: Panel;
  private originPanel: Panel;
  private imageId: ImageId;
  private routes: number[] = []; // suffle時にemptyIndexを記録する(逆順に辿るとゴールできる)
  private moveLogs: LogRow[] = []; // moveTo時にemptyIndexを記録する
  public getPanel = () => this.panel;
  public getRoutes = () => this.routes;
  public popRoutes = () => this.routes.pop();
  public getOriginPanel = () => this.originPanel;
  public getMoveLogs = () => this.moveLogs;
  public getImageId = () => this.imageId;
  public getServerPuzzleSet = (): Omit<ServerPuzzleSet, 'type'> => {
    console.log('getServerPuzzleSet', this.getImageId());
    return {
      originPanel: this.getOriginPanel(),
      moveLogs: this.getMoveLogs(),
      imageId: this.getImageId(),
    };
  };

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

  constructor(param: PuzzleSetConstructor) {
    switch (param.type) {
      case 'CloneConstructor': {
        const p = param.puzzleSet;
        this.panel = Array.from(p.panel) as Panel;
        this.routes = Array.from(p.routes);
        this.originPanel = p.originPanel;
        this.imageId = p.imageId;
        this.moveLogs = p.moveLogs;
        this.currentLogIndex = p.currentLogIndex;
        break;
      }
      case 'ServerPuzzleSetConstructor': {
        const isPlayer = param.isPlayer;
        const p = param.puzzleSet;
        this.panel = Array.from(p.originPanel) as Panel;
        this.originPanel = Array.from(this.panel) as Panel;
        this.imageId = p.imageId;
        if (!isPlayer) this.moveLogs = p.moveLogs;
        break;
      }
      case 'PanelConstructor': {
        const p = param.panel;
        this.panel = Array.from(p) as Panel;
        this.originPanel = Array.from(this.panel) as Panel;
        this.moveLogs = [];
        this.imageId = param.imageId;
        break;
      }
      case 'GenerateConstructor': {
        const {suffleTimes, size, imageId} = param;
        this.panel = new Array(size * size)
          .fill(0)
          .map((_v, i) => i + 1) as Panel;
        if (suffleTimes) {
          this.suffle(suffleTimes);
        }
        this.originPanel = Array.from(this.panel) as Panel;
        this.moveLogs = [];
        this.imageId = imageId;
        break;
      }
      default: {
        console.log('error', 'nonConstructor', param);
        throw 'non constructor';
      }
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
    return new PuzzleSet({type: 'CloneConstructor', puzzleSet: this});
  }
  isWin(): boolean {
    if (!this.panel) return false;
    return this.panel.every((v, i) => v === i + 1);
  }

  getResolveTime(): number {
    if (this.isWin()) {
      const lastIndex = this.moveLogs.length - 1;
      const time = this.moveLogs[lastIndex].time - this.moveLogs[0].time;
      return time;
    }
    return -1;
  }
}
