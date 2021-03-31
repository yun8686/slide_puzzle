import {ImageUrl} from '../util/api';
import {PuzzlePanelImageCache} from '../util/cache/image';

export const getCropImage = async (number: number) => {
  return await PuzzlePanelImageCache(ImageUrl, number);
};
