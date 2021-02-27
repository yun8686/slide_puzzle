import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {colors} from '../pallete';
import {useNavigation} from '@react-navigation/native';

const Title = () => {
  const navigation = useNavigation();
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
  text: {
    fontSize: 24,
    color: colors.buttonTextColor,
  },
});
export default Title;
