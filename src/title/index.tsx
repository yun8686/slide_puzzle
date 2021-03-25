import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../pallete';
import {useNavigation} from '@react-navigation/native';
import {updateMe, User} from '../models/user';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';

import {ScrollView, GestureHandlerRootView} from 'react-native-gesture-handler';
import {getMeFetch, updateMeFetch, getRanking} from '../util/api';
import {Flag} from 'react-native-svg-flagkit';

const Title = () => {
  const navigation = useNavigation();
  const [isEditNameModal, setIsEditNameModal] = useState<boolean>(false);
  const [isRankingModal, setIsRankingModal] = useState<boolean>(false);

  const [me, setMe] = useState<User>();
  useEffect(() => {
    getMeFetch()
      .then((me) => {
        setMe(me);
      })
      .catch((e) => {
        alert('network error');
        console.log('ERROR getMeFetch', e);
      });
    return () => {};
  }, []);
  if (!me) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{alignSelf: 'center', justifyContent: 'center'}}>
          Loading...
        </Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: '#8f3b76',
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 50,
          }}>
          SLIDING PUZZLE BATTLE
        </Text>
        <View
          style={{
            flexDirection: 'column',
            maxWidth: '100%',
            minWidth: '100%',
            padding: 30,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.push('CpuMatching');
            }}>
            <Text style={styles.text}>SINGLE PLAY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.push('Matching');
            }}
            style={styles.button}>
            <Text style={styles.text}>ONLINE PLAY</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => setIsEditNameModal(true)}>
            <Icon
              style={{alignSelf: 'center'}}
              name="cog"
              color={colors.settingColor}
              size={50}
            />
          </TouchableOpacity>
          <View style={{width: 20}}></View>
          <TouchableOpacity onPress={() => setIsRankingModal(true)}>
            <Icon
              style={{alignSelf: 'center'}}
              name="trophy"
              color={colors.rankingColor}
              size={50}
            />
          </TouchableOpacity>
        </View>
        {isEditNameModal || !me.name ? (
          <NameEditModal
            name={me.name}
            onDismiss={() => {
              setIsEditNameModal(false);
            }}
            onSubmit={async (updatedMe) => {
              setMe(updatedMe);
              updateMe(updatedMe);
              setIsEditNameModal(false);
            }}
          />
        ) : null}
        {isRankingModal ? (
          <RankingModal onDismiss={() => setIsRankingModal(false)} />
        ) : null}
      </View>
    </SafeAreaView>
  );
};
const RankingModal = ({onDismiss}: {onDismiss: () => void}) => {
  const [rankingList, setRankingList] = useState<User[]>([]);
  const [shown, setShown] = useState<boolean>(false);
  useEffect(() => {
    if (shown)
      getRanking()
        .then((rankings) => {
          setRankingList(rankings);
        })
        .catch((e) => {
          alert('network error');
          console.log('ERROR setRankingList', e);
        });
  }, [shown]);
  return (
    <Modal
      onModalShow={() => {
        setShown(true);
      }}
      isVisible={true}
      onDismiss={onDismiss}
      style={{alignContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          backgroundColor: '#FFF',
          alignContent: 'center',
          maxHeight: '80%',
          width: 360,
          maxWidth: '100%',
          padding: 20,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 32,
            paddingBottom: 20,
          }}>
          RANKING
        </Text>
        <View
          style={{
            paddingTop: 8,
            flexDirection: 'row',
            backgroundColor: colors.backgroundColor,
            width: 300,
            borderBottomWidth: 1,
          }}>
          <Text
            style={{
              flexBasis: 60,
              fontSize: 16,
              textAlign: 'center',
              alignSelf: 'flex-end',
            }}>
            Rank
          </Text>
          <Text
            style={{
              fontSize: 16,
              flexGrow: 1,
              paddingLeft: 32,
              alignSelf: 'flex-end',
            }}>
            Name
          </Text>
          <Text
            style={{
              flexBasis: 60,
              fontSize: 16,
              textAlign: 'center',
              alignSelf: 'flex-end',
            }}>
            Won
          </Text>
        </View>
        <GestureHandlerRootView
          style={{
            flexShrink: 1,
            flexGrow: 1,
            width: 300,
            backgroundColor: colors.backgroundColor,
          }}>
          <ScrollView style={{backgroundColor: colors.backgroundColor}}>
            {rankingList.length > 0 ? (
              rankingList.map((user, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 4,
                    }}>
                    <Text
                      style={{
                        flexBasis: 60,
                        fontSize: 16,
                        textAlign: 'center',
                        alignSelf: 'center',
                      }}>
                      {i + 1}
                    </Text>
                    <View style={{alignSelf: 'center', width: 16}}>
                      <Flag id={user.region || ''} width={16} height={16} />
                    </View>
                    <View
                      style={{
                        flexGrow: 1,
                        flexShrink: 1,
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          paddingLeft: 16,
                        }}>
                        {user.name}
                      </Text>
                    </View>
                    <Text
                      style={{
                        flexBasis: 60,
                        fontSize: 16,
                        textAlign: 'center',
                        alignSelf: 'center',
                      }}>
                      {user.winrate}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View
                style={{
                  width: 300,
                  minHeight: 40,
                  justifyContent: 'center',
                }}>
                <ActivityIndicator size="small" color={colors.buttonColor} />
              </View>
            )}
          </ScrollView>
        </GestureHandlerRootView>
        <View style={{marginTop: 20}} />
        <TouchableOpacity
          style={{
            alignSelf: 'center',
          }}
          onPress={() => {
            onDismiss();
          }}>
          <Text style={{color: colors.closeTextColor}}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
const NameEditModal = ({
  name,
  onDismiss,
  onSubmit,
}: {
  name: string;
  onDismiss: () => void;
  onSubmit: (updatedMe: User) => void;
}) => {
  const [editName, setEditName] = useState<string>(name);
  const [shouldSubmit, setShouldSubmit] = useState<boolean>(true);
  return (
    <Modal
      isVisible={true}
      onDismiss={onDismiss}
      style={{alignContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          backgroundColor: '#FFF',
          alignContent: 'center',
          maxHeight: 400,
          width: '80%',
          paddingHorizontal: 30,
          paddingBottom: 30,
        }}>
        <Text style={{textAlign: 'center', paddingVertical: 40, fontSize: 24}}>
          Input your in game name
        </Text>
        <TextInput
          placeholder="input your name"
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 8,
          }}
          onChangeText={(text) => setEditName(text)}
          value={editName}
        />
        <View style={{marginTop: 20}} />
        <TouchableOpacity
          style={{
            marginBottom: 20,
          }}
          disabled={!shouldSubmit}
          onPress={async () => {
            setShouldSubmit(false);
            const result = await updateMeFetch({name: editName});
            onSubmit(result);
          }}>
          <View style={styles.modalButton}>
            <Text style={{color: 'white'}}>Submit</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            flexShrink: 1,
          }}
          onPress={onDismiss}>
          <Text style={{color: colors.closeTextColor}}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundColor,
  },
  button: {
    flexGrow: 1,
    flexShrink: 1,
    height: 80,
    padding: 10,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: colors.buttonColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButton: {
    flexShrink: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colors.buttonColor,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  cancelModalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  text: {
    fontSize: 24,
    color: colors.buttonTextColor,
  },
});
export default Title;
