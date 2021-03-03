import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ViewStyle,
} from 'react-native';
import {colors} from '../pallete';
import {User, getMe} from '../models/user';
import {useNavigation} from '@react-navigation/native';
import {RoomId, MatchingData} from '../models/room';
import {getFindOtherUser} from '../util/api';
import {Flag} from 'react-native-svg-flagkit';
import {getCropImage, clearCache} from '../game/imageGenerator';
import {PuzzleSet} from '../game/PuzzleSet';
const WINDOW_WIDTH = Dimensions.get('screen').width;

const CpuMatching = () => {
  const [matchingData, setMatchingData] = useState<MatchingData | undefined>(
    undefined,
  );

  const [waitTime, setWaitTime] = useState<number>(10);
  const navigation = useNavigation();
  useEffect(() => {
    (async () => {
      const matchingData = await getFindOtherUser(true);
      clearCache();
      await Promise.all(
        new Array(16).map((_key, i) => {
          return getCropImage(i + 1);
        }),
      );
      setWaitTime(() => 4);
      setMatchingData({
        user: matchingData.user,
        puzzleSet: matchingData.puzzleSet,
      });
    })();
  }, [getMe()]);

  useEffect(() => {
    if (waitTime === 0 && matchingData) {
      navigation.replace('Game', {matchingData, mode: 'CPU'});
    } else {
      const timeout = setTimeout(() => {
        setWaitTime(waitTime - 1);
      }, 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [waitTime]);
  return (
    <SafeAreaView>
      <Finding
        otherUser={matchingData?.user}
        waitTime={waitTime}
        onCancel={!matchingData?.user ? () => navigation.pop() : undefined}
      />
    </SafeAreaView>
  );
};

type FindingProps = {
  otherUser?: User;
  waitTime: number;
  onCancel?: () => void;
};
const Finding = ({otherUser, onCancel, waitTime}: FindingProps) => {
  return (
    <View style={styles.conteiner}>
      <Text style={{fontSize: 24}}>
        {otherUser ? 'Matched other player' : 'Looking for opponent...'}
      </Text>
      <View
        style={{
          height: '40%',
          justifyContent: 'space-between',
        }}>
        <UserInfo user={getMe()} />
        {otherUser ? (
          <Text style={{fontSize: 20, textAlign: 'center'}}>VS</Text>
        ) : null}
        {otherUser ? <UserInfo user={otherUser} /> : null}
      </View>
      {onCancel ? (
        <TouchableOpacity onPress={onCancel} style={styles.button}>
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          disabled
          onPress={onCancel}
          style={styles.buttonDisabled}>
          <Text style={styles.disabledText}>Cancel</Text>
        </TouchableOpacity>
      )}
      <Text style={{fontSize: 24}}>
        {otherUser ? `connecting${['...', '.. ', '.  '][waitTime % 3]}` : ' '}
      </Text>
    </View>
  );
};

const UserInfo = ({user}: {user: User}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: WINDOW_WIDTH * 0.8,
      }}>
      <Flag id={user.region} width={60} height={60} />
      <View
        style={{
          justifyContent: 'space-evenly',
          paddingLeft: 20,
        }}>
        <Text style={{fontSize: 20}}>{user.name}</Text>
        <Text style={{fontSize: 20}}>WinRate {user.winrate}</Text>
      </View>
    </View>
  );
};

const buttonBase: ViewStyle = {
  maxWidth: 250,
  minWidth: 250,
  padding: 10,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: colors.buttonColor,
  alignItems: 'center',
  justifyContent: 'center',
  margin: 3,
};
const styles = StyleSheet.create({
  conteiner: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundColor,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {...buttonBase},
  buttonDisabled: {
    ...buttonBase,
    borderColor: colors.buttonDisabledColor,
  },
  text: {
    fontSize: 26,
    color: colors.buttonColor,
  },
  disabledText: {
    fontSize: 26,
    color: colors.buttonDisabledColor,
  },
});

export default CpuMatching;