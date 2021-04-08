import React, {useState, useEffect, ReactElement, ReactNode} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import Puzzle from './Puzzle';
import {colors} from '../pallete';
import {User} from '../models/user';
import {RootStackParamList} from '../../App';
import {PuzzleSet} from './PuzzleSet';
import {useNavigation} from '@react-navigation/native';
import {Flag} from 'react-native-svg-flagkit';
import {sendPuzzleSet} from '../util/api';

const {width, height} = Dimensions.get('screen');
const WINDOW_WIDTH = width;
const PUZZLE_WIDTH = Math.min(WINDOW_WIDTH, height / 2);
console.log('PUZZLE_WIDTH', PUZZLE_WIDTH);
const PANE_SIZE = 4;
export type GameMode = 'CPU' | 'PLAYER';
export type Panel = number[] & {__panel: never};
type Props = {
  route: {params: RootStackParamList['Game']};
};
const Game = ({route}: Props) => {
  const navigation = useNavigation();
  const {
    mode: gameMode,
    matchingData: {user: otherUser, puzzleSet: basePuzzleSet},
    imageUri,
  } = route.params;
  const [panel, setPanel] = useState<PuzzleSet>();
  const [otherPanel, setOtherPanel] = useState<PuzzleSet>();
  const [waitTime, setWaitTime] = useState(5);
  const [isModelModal, setModelModal] = useState<boolean>(false);
  const [isNavigated, setIsNavigated] = useState<boolean>(false);

  useEffect(() => {
    if (basePuzzleSet) {
      setPanel(() => new PuzzleSet(basePuzzleSet, true));
    }
    return () => {};
  }, [basePuzzleSet]);
  useEffect(() => {
    if (basePuzzleSet) {
      setOtherPanel(() => new PuzzleSet(basePuzzleSet, false));
    }
    return () => {};
  }, [basePuzzleSet]);
  useEffect(() => {
    if (!otherPanel) return;
    if (waitTime >= 0) {
      const timeout = setTimeout(() => {
        setWaitTime(waitTime - 1);
      }, 1000);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      if (waitTime <= 0 && !panel?.isWin() && !otherPanel?.isWin()) {
        const {logRow: nextLogRow, waitTime} = otherPanel.popMoveLog();
        if (nextLogRow !== undefined) {
          const timeout = setTimeout(() => {
            otherPanel.moveTo(nextLogRow.emptyIndex, false);
            setOtherPanel(() => otherPanel.clone());
          }, waitTime);
          return () => {
            clearTimeout(timeout);
          };
        }
      }
    }
    return () => {};
  }, [otherPanel, waitTime]);

  const isWon = !!panel && panel.isWin();
  const isLose = !!otherPanel && otherPanel.isWin();

  useEffect(() => {
    if (isWon && panel) {
      sendPuzzleSet(gameMode, panel);
    }
    return () => {};
  }, [isWon]);

  if (!panel || !otherPanel) return <SafeAreaView></SafeAreaView>;
  return (
    <SafeAreaView>
      {waitTime >= 0 ? <WaitingModal waitTime={waitTime} /> : null}
      {isModelModal ? <ModelModal imageUri={imageUri} /> : null}
      {isWon || isLose ? (
        <ResultModal
          isWin={isWon}
          panel={panel}
          onClickNextGame={() => {
            if (!isNavigated) {
              setIsNavigated(true);
              if (gameMode === 'CPU') {
                navigation.replace('CpuMatching');
              } else if (gameMode === 'PLAYER') {
                navigation.replace('Matching');
              }
            }
          }}
          onClickBackToTitle={() => {
            navigation.pop();
          }}
        />
      ) : null}
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.userInfoWrapper}>
            <UserInfo user={otherUser} />
          </View>
          <Puzzle
            imageUri={imageUri}
            width={~~(PUZZLE_WIDTH / 12) * 4}
            panel={otherPanel.getPanel()}
            panelSize={PANE_SIZE}
          />
        </View>
        <Puzzle
          imageUri={imageUri}
          width={PUZZLE_WIDTH}
          panel={panel.getPanel()}
          onTouchIndex={(nextIndex) => {
            panel.moveTo(nextIndex, true);
            setPanel(() => panel.clone());
          }}
          panelSize={PANE_SIZE}
        />
        <View style={styles.footerContainer}>
          <View style={styles.modelButton}>
            <TouchableOpacity
              onPressIn={() => setModelModal(true)}
              onPressOut={() => setModelModal(false)}>
              <Icon
                style={{alignSelf: 'center'}}
                name="image"
                color={colors.circleButtonIconColor}
                size={50}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const UserInfo = ({user}: {user: User}) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <Flag id={user.region} width={60} height={60} />
      <View
        style={{
          justifyContent: 'space-evenly',
        }}>
        <Text style={{fontSize: 20}}>{user.name}</Text>
      </View>
    </View>
  );
};

const WaitingModal = ({waitTime}: {waitTime: number}) => {
  return <CenterModal text={waitTime > 0 ? waitTime.toString() : 'start'} />;
};
const ResultModal = ({
  isWin,
  panel,
  onClickNextGame,
  onClickBackToTitle,
}: {
  isWin: boolean;
  panel: PuzzleSet;
  onClickNextGame: () => void;
  onClickBackToTitle: () => void;
}) => {
  const resolveTime = panel.getResolveTime() / 1000;
  return (
    <CenterModal text={isWin ? 'You win!' : 'You lose...'}>
      {isWin ? (
        <Text style={{fontSize: 24}}>time: {resolveTime} sec</Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          width: '95%',
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          onPress={onClickBackToTitle}
          style={styles.backButton}>
          <Text style={{color: colors.buttonColor, fontSize: 30}}>
            Back to Title
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClickNextGame} style={styles.button}>
          <Text style={{color: 'white', fontSize: 30}}>Next Game</Text>
        </TouchableOpacity>
      </View>
    </CenterModal>
  );
};
const CenterModal = ({
  text,
  children,
}: {
  text: string;
  children?: ReactNode;
}) => {
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
          width: '100%',
          backgroundColor: colors.timerBackgroundColor,
          opacity: 0.8,
        }}>
        <Text style={{color: 'black', fontSize: 40}}>{text}</Text>
        {children}
      </View>
    </View>
  );
};

const ModelModal = ({imageUri}: {imageUri: string}) => {
  return (
    <Modal isVisible={true}>
      <View
        style={{
          position: 'absolute',
          zIndex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: imageUri}}
          style={{
            width: WINDOW_WIDTH,
            height: WINDOW_WIDTH,
            maxWidth: PUZZLE_WIDTH,
            maxHeight: PUZZLE_WIDTH,
            marginTop: ~~(PUZZLE_WIDTH / 12) * 2 + 10,
          }}></Image>
      </View>
    </Modal>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundColor,
  },
  headerContainer: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: colors.backgroundColor,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    width: WINDOW_WIDTH,
    maxWidth: PUZZLE_WIDTH,
    padding: 20,
  },
  footerContainer: {
    flexGrow: 1,
    flexShrink: 1,
    width: '100%',
    maxWidth: PUZZLE_WIDTH,
    backgroundColor: colors.backgroundColor,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  userInfoWrapper: {flexGrow: 1, marginRight: 20},
  board: {},
  backButton: {
    flexShrink: 1,
    flexGrow: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.buttonColor,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
    marginTop: 20,
  },
  button: {
    flexShrink: 1,
    flexGrow: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.buttonColor,
    backgroundColor: colors.buttonColor,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
    marginTop: 20,
  },
  modelButton: {
    width: 90,
    height: 90,
    alignSelf: 'flex-end',
    borderRadius: 90,
    borderWidth: 1,
    borderColor: colors.circleButtonColor,
    backgroundColor: colors.circleButtonColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
});
