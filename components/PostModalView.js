import { ScrollView, StyleSheet, View, Image, TextInput, StatusBar, Alert } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import FText from './Ftext';
import Icons from 'react-native-vector-icons/AntDesign';
import { Ionicons } from 'react-native-vector-icons';
import { colours } from '../constants/colours';
import useHandlePosts from '../hooks/useHandlePosts';
import useImageHandler from '../hooks/useImageHandler';
import LottieView from 'lottie-react-native';

const PostModalView = ({ postData, selectedImages, defaultPostData, setSelectedImages, setPostData, setPostModal, fnUnSelectImage, fnUploadMultipleImages }) => {

  const { fnAddPost } = useHandlePosts();
  const { uploadImageToFirebase } = useImageHandler();

  const [loader, setLoader] = useState(false);

  const fnOnSave = async () => {
    if(postData?.userId && (postData?.content || postData?.images?.length > 0)) {
      try {
        setLoader(true);
        const newImages = await Promise.all(
          selectedImages?.map(async (uri) => {
            const imageUrl = await uploadImageToFirebase('posts/', uri);
            return imageUrl;
          })
        );
        await fnAddPost({ ...postData, images: newImages });
        fnEmptyData();
      } catch (error) {
        fnEmptyData();
      }
    } else {
      Alert.alert(
        'Warning',
        "Please add some content!"
      )
    }
  };

  const fnEmptyData = () => {
    setPostModal(false);
    setLoader(false);
    setPostData(defaultPostData);
    setSelectedImages([]);
  };

  return (
    <>
      <ScrollView style={{ flex: 1, paddingTop: StatusBar.currentHeight }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='always'>

        <View style={styles.modalContainer}>

          <View style={styles.postHeader} >
            <FText> Add Post </FText>
            <TouchableOpacity style={styles.saveBtn} onPress={fnOnSave} >
              <FText style={styles.saveBtnTxt}> Post </FText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={fnUploadMultipleImages} style={styles.postBox} >

            {selectedImages?.length > 0 ?
              selectedImages?.map((image, index) => {
                return (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: image }} style={styles.previewImage} />
                    <TouchableOpacity onPress={() => fnUnSelectImage(image)} style={styles.removeButton}>
                      <Ionicons name="close-circle" size={18} color="red" />
                    </TouchableOpacity>
                  </View>
                )
              })
              : <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icons name="pluscircle" size={20} color='#8BC83F' />
                <FText fontSize="small" fontWeight={700} color={colours.success}> Choose Images <FText fontSize="small" fontWeight={700} color={colours.typography_60}> or drop here </FText></FText>
              </View>}

          </TouchableOpacity>

          <TextInput
            onChangeText={(text) => setPostData((pre) => ({ ...pre, content: text }))}
            placeholder='Write anything here...'
            cursorColor={colours.primary}
            style={styles.input}
            multiline={true}
          />

        </View>

      </ScrollView>
      {loader &&
        <View style={styles.lottieBox}>
          <LottieView source={require('../assets/animations/upload_animation.json')} style={{ height: 120, width: 120, bottom: 40 }} autoPlay loop />
        </View>
      }
    </>
  )
}

export default PostModalView

const styles = StyleSheet.create({
  saveBtn : {
    backgroundColor: colours.primary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24
  },
  saveBtnTxt : {
    color:'white', fontSize:12, bottom: 1
  },
  postHeader: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 5
  },
  input: {
    width: '100%',
    backgroundColor:colours.lighter_border,
    padding: 12
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    margin: 5,
  },
  removeButton: {
    position: 'absolute',
    top: -4,
    right: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 50,
    padding: 5,
    elevation: 1
  },
  modalContainer: {
    flex: 1, alignItems: 'center', marginHorizontal: 18, marginVertical: 18, gap: 16
  },
  postImg: {
    height: 200, width: '92%', borderRadius: 12
  },
  imagesBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
  },
  postBox: {
    height: 230,
    width: '100%',
    borderRadius: 12,
    borderColor: colours.aslo_gray,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  lottieBox: {
    position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
})