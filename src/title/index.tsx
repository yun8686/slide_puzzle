import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TextInput} from 'react-native';
import {colors} from '../pallete';
import {useNavigation} from '@react-navigation/native';
import {getMe, updateMe, User} from '../models/user';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {getMeFetch, updateMeFetch} from '../util/api';
const Title = () => {
  const navigation = useNavigation();
  const [isEditNameModal, setIsEditNameModal] = useState<boolean>(false);
  const [me, setMe] = useState<User>();
  useEffect(() => {
    getMeFetch().then((me) => {
      updateMe(me);
      setMe(me);
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
        <Text style={{color: '#8f3b76', fontSize: 30, marginBottom: 50}}>
          SLIDING PUZZLE BATTLE
        </Text>
        <View
          style={{
            flexDirection: 'row',
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
              color={colors.buttonColor}
              size={50}
            />
          </TouchableOpacity>
          <View style={{width: 20}}></View>
          <Icon
            style={{alignSelf: 'center'}}
            name="trophy"
            color={colors.buttonColor}
            size={50}
          />
        </View>
        {isEditNameModal ? (
          <NameEditModal
            name={me.name}
            onDismiss={() => {
              setIsEditNameModal(false);
            }}
            onSubmit={async (updatedMe) => {
              setMe(updatedMe);
              setIsEditNameModal(false);
            }}
          />
        ) : null}
      </View>
    </SafeAreaView>
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
            alignSelf: 'center',
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
    borderRadius: 10,
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
  text: {
    fontSize: 24,
    color: colors.buttonTextColor,
  },
});
export default Title;
