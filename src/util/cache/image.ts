import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageEditor from '@react-native-community/image-editor';
import RNFS from 'react-native-fs';

export const getFullPuzzleImage = async (imageUrl: string) => {
  const storageKey = `PuzzleImageCache__${imageUrl}`;
  let image = await AsyncStorage.getItem(storageKey);
  const isExists = image ? await RNFS.exists(image) : false;
  if (!isExists) {
    image = await ImageEditor.cropImage(imageUrl, {
      offset: {
        x: 0,
        y: 0,
      },
      size: {
        width: 640,
        height: 640,
      },
    });
    await AsyncStorage.setItem(storageKey, image);
  }
  return image as string;
};
export const PuzzlePanelImageCache = async (
  imageUrl: string,
  number: number,
) => {
  const storageKey = `PuzzleImageCache__${imageUrl}__${number}`;
  let image = await AsyncStorage.getItem(storageKey);
  const isExists = image ? await RNFS.exists(image) : false;
  if (!isExists) {
    const fullImage = await getFullPuzzleImage(imageUrl);
    image = await ImageEditor.cropImage(fullImage, {
      offset: {
        x: Math.floor((number - 1) % 4) * 160,
        y: Math.floor((number - 1) / 4) * 160,
      },
      size: {
        width: 160,
        height: 160,
      },
    });
    await AsyncStorage.setItem(storageKey, image);
  }
  return image as string;
};
