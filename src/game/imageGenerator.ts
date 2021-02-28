const panelImg = require('../assets/panel.png');
const panelImg2 = require('../assets/panel2.png');
import ImageEditor from '@react-native-community/image-editor';
import {Image} from 'react-native';

const ImageCatche: {[number: string]: string} = {};
export const clearCache = () => {
  Object.keys(ImageCatche).forEach((key) => {
    delete ImageCatche[key];
  });
};
export const getCropImage = async (number: number) => {
  if (!ImageCatche[number]) {
    ImageCatche[number] = await ImageEditor.cropImage(
      Image.resolveAssetSource(panelImg).uri,
      {
        offset: {
          x: Math.floor((number - 1) % 4) * 160,
          y: Math.floor((number - 1) / 4) * 160,
        },
        size: {
          width: 160,
          height: 160,
        },
      },
    );
  }
  return ImageCatche[number];
};
