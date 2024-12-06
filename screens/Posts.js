import { Modal, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Icons from 'react-native-vector-icons/AntDesign';
import FText from '../components/Ftext';
import { colours } from '../constants/colours';
import BackButton from '../components/BackButtons';
import * as ImagePicker from 'expo-image-picker';
import PostModalView from '../components/PostModalView';
import ViewPost from '../components/ViewPost';
import useHandlePosts from '../hooks/useHandlePosts';
import useUserManager from '../hooks/useUserManager';
import ViewUserPost from '../components/ViewUserPost';

const Posts = () => {

    const defaultPostData = { content: "", images: [], userId: null, name: "", email: "", profilePic: "" };

    const [postModal, setPostModal] = useState(false);
    const [postData, setPostData] = useState(defaultPostData);
    const [allPosts, setAllPosts] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    const { currentUser } = useUserManager();
    const { fnGetPosts } = useHandlePosts();

    useEffect(() => {
        const unsubscribe = fnGetPosts(setAllPosts);
        return unsubscribe;
    }, []);

    useEffect(() => {
        setPostData((pre) => ({
            ...pre,
            userId: currentUser?.id,
            name: currentUser?.fullName,
            email: currentUser?.email,
            profilePic: currentUser?.profilePic
        }))
    }, [currentUser]);


    const fnUploadMultipleImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const newImages = result?.assets?.map((image) => {
                return image?.uri;
            });
            setSelectedImages((pre) => [...pre, ...newImages]);
        }
    };

    const fnUnSelectImage = (image) => {
        const filteredImages = selectedImages?.filter((uri) => uri !== image);
        setSelectedImages(filteredImages);
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            <BackButton />

            <TouchableOpacity onPress={() => setPostModal(true)} style={styles.ListingContainer}>
                <Icons name="pluscircle" size={20} color='#8BC83F' />
                <FText fontSize="small" fontWeight={700} color={colours.primary}> New Post </FText>
            </TouchableOpacity>


            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }} keyboardShouldPersistTaps='always' >
                <View style={styles.container}>
                    <StatusBar backgroundColor={'white'} barStyle={'light-content'} />

                    <FText style={styles.heading} >
                        See What others are Discussing
                    </FText>

                    {allPosts?.length > 0 ?
                        allPosts?.map((post) => <ViewPost key={post?.id} post={post} />)
                        : <View style={{ flex: 0.85, alignItems: 'center', justifyContent: 'center' }} >
                            <FText> No Posts Yet </FText>
                        </View>
                    }

                </View>
                <Modal visible={postModal} statusBarTranslucent={true} onRequestClose={() => setPostModal(false)} >
                    <PostModalView
                        postData={postData}
                        selectedImages={selectedImages}
                        setSelectedImages={setSelectedImages}
                        defaultPostData={defaultPostData}
                        setPostData={setPostData}
                        setPostModal={setPostModal}
                        fnUnSelectImage={fnUnSelectImage}
                        fnUploadMultipleImages={fnUploadMultipleImages}
                    />
                </Modal>
            </ScrollView>

        </View>
    )
}

export default Posts

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'white', paddingHorizontal: 20, gap: 16
    },
    heading: {
        textAlign: 'center', fontSize: 14, color: '#949494'
    },
    ListingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        height: 45,
        backgroundColor: '#F4F5F8',
        width: '55%',
        marginTop: 50,
        borderRadius: 10,
        marginBottom: 12,
        gap: 4
    },
})