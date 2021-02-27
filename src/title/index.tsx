import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {colors} from '../pallete';
import {useNavigation} from '@react-navigation/native';
import {getMe} from '../models/user';
import Modal from 'react-native-modal';

const Title = () => {
  const navigation = useNavigation();
  const [isEditNameModal, setIsEditNameModal] = useState<boolean>(false);
  const [name, setName] = useState<string>(getMe().name);

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
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.push('Matching');
            }}
            style={styles.button}>
            <Text style={styles.text}>SINGLE PLAY</Text>
          </TouchableOpacity>
          <View style={{minWidth: 10}}></View>
          <TouchableOpacity onPress={() => {}} style={styles.button}>
            <Text style={styles.text}>ONLINE PLAY</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={isEditNameModal}
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
          <Text
            style={{textAlign: 'center', paddingVertical: 40, fontSize: 24}}>
            Input your name
          </Text>
          <TextInput
            placeholder="input your name"
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 8,
            }}
            onChangeText={(text) => setName(text)}
            value={name}
          />
          <TouchableOpacity
            onPress={() => setIsEditNameModal(false)}
            style={styles.modalButton}>
            <Text style={{color: 'white'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
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
    flexGrow: 1,
    flexShrink: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.buttonColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
    height: 40,
  },
  text: {
    fontSize: 24,
    color: colors.buttonTextColor,
  },
});
export default Title;
