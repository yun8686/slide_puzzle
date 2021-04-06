import React, {useState, useEffect} from 'react';
import {RootStackParamList} from '../../App';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../pallete';
import {scale} from 'react-native-size-matters';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {getGallary, getImageUrl} from '../util/api';
import {ImageInfo} from '../../slide_puzzle_api/src/models/image';
import {getFullPuzzleImage} from '../util/cache/image';
import {BallIndicator} from 'react-native-indicators';

const WINDOW_WIDTH = Dimensions.get('screen').width;

type Props = {
  route: {params: RootStackParamList['Gallary']};
};
interface LocalImageInfo extends ImageInfo {
  localUri: string;
}
const Gallary = ({route}: Props) => {
  const navigation = useNavigation();
  const [gallary, setGallary] = useState<LocalImageInfo[]>();
  const [isNavigate, setIsNavigate] = useState<boolean>();
  useEffect(() => {
    (async () => {
      const gallary = await getGallary();
      const localGallary: LocalImageInfo[] = [];
      for (const g of gallary) {
        localGallary.push({
          ...g,
          localUri: await getFullPuzzleImage(getImageUrl(g)),
        });
      }
      setGallary(localGallary);
    })();
    return () => {};
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={{alignSelf: 'center', fontSize: scale(32)}}>Gallary</Text>
        {gallary ? (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {gallary.map((v) => (
              <TouchableOpacity
                style={styles.cardWrapper}
                key={`${v._id}`}
                onPress={() => {
                  if (!isNavigate) {
                    setIsNavigate(true);
                    navigation.replace('Matching', {
                      imageUri: v.localUri,
                    });
                  }
                }}>
                <View style={styles.cardImage}>
                  <Image
                    source={{
                      uri: v.localUri,
                    }}
                    style={styles.cardImage}
                  />
                </View>
                <Text style={styles.cardText}>{v.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <BallIndicator size={60} />
        )}
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
