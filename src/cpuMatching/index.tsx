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
import {getFindOtherUser, getImageUrl} from '../util/api';
import {Flag} from 'react-native-svg-flagkit';
import {getCropImage} from '../game/imageGenerator';
import {PuzzleSet} from '../game/PuzzleSet';
import {Card} from 'react-native-elements';
import {RootStackParamList} from '../../App';
const WINDOW_WIDTH = Dimensions.get('screen').width;

type Props = {
  route: {params: RootStackParamList['CpuMatching']};
};
const CpuMatching = ({route}: Props) => {
  const imageId = route.params?.imageId;
  const imageUrl = getImageUrl(imageId);

  const [matchingData, setMatchingData] = useState<MatchingData | undefined>(
    undefined,
  );

  const [waitTime, setWaitTime] = useState<number>(10);
  const navigation = useNavigation();
  const [isMounted, setIsMounted] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      const matchingData = await getFindOtherUser({
        isCpu: true,
        imageId,
      });
      await Promise.all(
        new Array(16).fill('').map((_key, i) => {
          return getCropImage(imageUrl, i + 1);
        }),
      );
      if (isMounted) {
        setWaitTime(4);
        setMatchingData({
          user: matchingData.user,
          puzzleSet: matchingData.puzzleSet,
        });
      }
    })();
    return () => {
      setIsMounted(false);
    };
  }, [getMe()]);

  useEffect(() => {
    if (waitTime === 0 && matchingData) {
      navigation.replace('Game', {
        matchingData,
        mode: 'CPU',
        imageId: imageId,
      });
      return () => {};
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
      <Text style={{fontSize: 24}}>Single Play Mode</Text>
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
      <Text style={{fontSize: 24}}>
        {otherUser
          ? `Shuffling the puzzle${['...', '.. ', '.  '][waitTime % 3]}`
          : ' '}
      </Text>
    </View>
  );
};

const UserInfo = ({user}: {user: User}) => {
  return (
    <Card>
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
          {user.deviceId !== 'cpu' ? (
            <Text style={{fontSize: 20}}>Number of wins {user.winrate}</Text>
          ) : null}
        </View>
      </View>
    </Card>
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
