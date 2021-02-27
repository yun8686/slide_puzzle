const panelImg = require('../assets/panel.png');
import ImageEditor from '@react-native-community/image-editor';
import {Image} from 'react-native';

export const getCropImage = (number: number) => {
  return ImageEditor.cropImage(Image.resolveAssetSource(panelImg).uri, {
    offset: {
      x: Math.floor((number - 1) % 4) * 160,
      y: Math.floor((number - 1) / 4) * 160,
    },
    size: {
      width: 160,
      height: 160,
    },
  });
};
