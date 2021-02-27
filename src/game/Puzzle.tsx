import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  RegisteredStyle,
} from 'react-native';
import {Panel} from '.';

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
  return (
    <View
      onTouchEnd={onTouchEnd}
      style={{
        width: width - 2,
        height: width - 2,
        borderWidth: 1,
        borderRadius: width / 10,
        margin: 1,
        backgroundColor: 'lightgreen',
        opacity: shown ? 0 : 1,
      }}>
      <Text>{num}</Text>
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
