import React from 'react';
import {RootStackParamList} from '../../App';
import {SafeAreaView, StyleSheet, View, Text, Dimensions} from 'react-native';
import {colors} from '../pallete';
import {scale} from 'react-native-size-matters';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

const WINDOW_WIDTH = Dimensions.get('screen').width;

type Props = {
  route: {params: RootStackParamList['Gallary']};
};
const Gallary = ({route}: Props) => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={{alignSelf: 'center', fontSize: scale(32)}}>Gallary</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {new Array(30).fill(0).map((v) => (
            <TouchableOpacity style={styles.cardWrapper}>
              <View style={styles.cardImage}></View>
              <Text style={styles.cardText}>Cat</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundColor,
  },
  scrollContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardWrapper: {padding: 10, width: WINDOW_WIDTH / 3},
  cardImage: {
    width: WINDOW_WIDTH / 3 - 20,
    height: WINDOW_WIDTH / 3 - 20,
    backgroundColor: 'red',
  },
  cardText: {alignSelf: 'center'},
});
export default Gallary;
