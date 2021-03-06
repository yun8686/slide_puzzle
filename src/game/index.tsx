import React, {useState, useEffect, ReactElement} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Puzzle from './Puzzle';
import {colors} from '../pallete';
import {User} from '../models/user';
import {RootStackParamList} from '../../App';
import {PuzzleSet} from './PuzzleSet';
import {useNavigation} from '@react-navigation/native';
import {Flag} from 'react-native-svg-flagkit';
import {sendPuzzleSet} from '../util/api';

const WINDOW_WIDTH = Dimensions.get('screen').width;
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
  } = route.params;
  const [panel, setPanel] = useState<PuzzleSet>();
  const [otherPanel, setOtherPanel] = useState<PuzzleSet>();
  const [waitTime, setWaitTime] = useState(5);

  useEffect(() => {
    if (basePuzzleSet) {
      setPanel(() => new PuzzleSet(basePuzzleSet, true));
    }
  }, [basePuzzleSet]);
  useEffect(() => {
    if (basePuzzleSet) {
      setOtherPanel(() => new PuzzleSet(basePuzzleSet, false));
    }
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
  }, [otherPanel, waitTime]);

  const isWon = !!panel && panel.isWin();
  const isLose = !!otherPanel && otherPanel.isWin();

  useEffect(() => {
    if (isWon && panel) {
      sendPuzzleSet(gameMode, panel);
    }
  }, [isWon]);

  if (!panel || !otherPanel) return <SafeAreaView></SafeAreaView>;
  return (
    <SafeAreaView>
      {waitTime >= 0 ? <WaitingModal waitTime={waitTime} /> : null}
      {isWon || isLose ? (
        <ResultModal
          isWin={isWon}
          onClickNextGame={() => {
            if (gameMode === 'CPU') {
              navigation.replace('CpuMatching');
            } else if (gameMode === 'PLAYER') {
              navigation.replace('Matching');
            }
          }}
          onClickBackToTitle={() => {
            navigation.replace('Title');
          }}
        />
      ) : null}
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.userInfoWrapper}>
            <UserInfo user={otherUser} />
          </View>
          <Puzzle
            width={WINDOW_WIDTH / 3}
            panel={otherPanel.getPanel()}
            panelSize={PANE_SIZE}
          />
        </View>
        <Puzzle
          width={WINDOW_WIDTH}
          panel={panel.getPanel()}
          onTouchIndex={(nextIndex) => {
            panel.moveTo(nextIndex, true);
            setPanel(() => panel.clone());
          }}
          panelSize={PANE_SIZE}
        />
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
  return <CenterModal text={waitTime.toString()} />;
};
const ResultModal = ({
  isWin,
  onClickNextGame,
  onClickBackToTitle,
}: {
  isWin: boolean;
  onClickNextGame: () => void;
  onClickBackToTitle: () => void;
}) => {
  return (
    <CenterModal text={isWin ? 'You win!' : 'You lose...'}>
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
  children?: ReactElement;
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
          backgroundColor: colors.backgroundColor,
          opacity: 0.8,
        }}>
        <Text style={{color: 'black', fontSize: 40}}>{text}</Text>
        {children}
      </View>
    </View>
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
    backgroundColor: colors.backgroundColor,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH / 2,
    padding: 20,
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
});
