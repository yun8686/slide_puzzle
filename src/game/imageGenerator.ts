import {ImageUrl} from '../util/api';
import {PuzzlePanelImageCache} from '../util/cache/image';

export const getCropImage = async (imageUrl: string, number: number) => {
  return await PuzzlePanelImageCache(imageUrl, number);
};
