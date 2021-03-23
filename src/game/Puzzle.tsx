import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Panel} from '.';
import {getCropImage} from './imageGenerator';

const Cell = ({
  num,
  onTouchEnd,
  shown,
  width,
}: {
  num: number;
  shown: boolean;
  width: number;
  onTouchEnd: () => void;
}) => {
  const [image, setImage] = useState<string>('');
  useEffect(() => {
    (async () => {
      try {
        const image = await getCropImage(num);
        setImage(image);
      } catch (e) {
        console.log('error', e);
      }
    })();
    return () => {};
  }, []);

  return (
    <View
      onTouchEnd={onTouchEnd}
      style={{
        width: width,
        height: width,
        opacity: shown ? 0 : 1,
      }}>
      {image ? (
        <Image source={{uri: image}} style={{width: width, height: width}} />
      ) : null}
    </View>
  );
};

type MoveProps = {
  panel: Panel;
  num: number;
  panelSize: number;
};

type Puzzle = {
  width: number;
  panel: Panel;
  onTouchIndex?: (index: number) => void;
  panelSize: number;
};
const Puzzle = ({width, panel, panelSize, onTouchIndex}: Puzzle) => {
  return (
    <View
      style={{
        width: width,
        height: width,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      {panel.map((v, i) => {
        return (
          <Cell
            key={v}
            width={width / panelSize}
            onTouchEnd={() => {
              onTouchIndex && onTouchIndex(i);
            }}
            num={v}
            shown={v === panelSize * panelSize}
          />
        );
      })}
    </View>
  );
};
export default Puzzle;

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'yellow',
  },
  board: {},
});
