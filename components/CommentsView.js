import { StyleSheet, Text, TextInput, View, Image, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import useHandlePosts from '../hooks/useHandlePosts'
import FText from './Ftext';
import { TouchableOpacity } from 'react-native';
import useUserManager from '../hooks/useUserManager';
import { colours } from '../constants/colours';
import fonts from '../constants/fonts';
import Feather from 'react-native-vector-icons/Feather'

const CommentsView = ({ post }) => {

    const defaultCommentData = { name: "", profilePic: "", userId: null, comment: "" }
    const [allComments, setAllComments] = useState([]);
    const [commentData, setCommentData] = useState(defaultCommentData);

    const { fnGetComments, fnAddComment } = useHandlePosts();
    const { currentUser } = useUserManager();

    useEffect(() => { fnGetComments(post?.id, setAllComments); }, []);
    useEffect(() => {
        setCommentData((pre) => ({ ...pre, name: currentUser?.fullName, profilePic: currentUser?.profilePic, userId: currentUser?.id }))
    }, [currentUser]);

    const fnOnChange = (text) => {
        setCommentData((pre) => ({ ...pre, comment: text }));
    };

    const fnOnSaveComment = async () => {
       if(commentData?.userId && commentData?.comment) {
        setCommentData(defaultCommentData);
        await fnAddComment(post?.id, commentData);
       } else {
        Alert.alert(
            'Warning',
            'Please write comment first!'
        )
       }
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always' contentContainerStyle={{ flexGrow: 1, gap: 20 }} showsVerticalScrollIndicator={false}>
                {allComments?.length > 0 ?
                    allComments?.map((detail, i) => {
                        return (
                            <View key={i} style={styles.commentContainer} >
                                <Image source={{ uri: detail?.profilePic }} style={styles.userImg} />
                                <View style={styles.commentBox} >
                                    <FText style={styles.name}>{detail?.name}</FText>
                                    <FText style={styles.comment}>{detail?.comment}</FText>
                                </View>
                            </View>
                        )
                    })
                    : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                        <FText>No Comments</FText>
                    </View>
                }
            </ScrollView>
            <View style={styles.inputBox} >
                <TextInput placeholder='Write comment' style={styles.input} value={commentData?.comment} onChangeText={(text) => fnOnChange(text)} />
                <TouchableOpacity style={styles.sendBtn} onPress={fnOnSaveComment} >
                    <Feather name='send' color={'white'} size={22} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CommentsView

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, backgroundColor: 'white', paddingHorizontal: 20, marginTop: 20
    },
    userImg: {
        height: 40, width: 40, borderRadius: 20
    },
    commentContainer: {
        flexDirection: 'row', alignItems: 'center', gap: 8
    },
    commentBox: {
        borderRadius: 18, backgroundColor: colours.lighter_border, gap: 4, paddingHorizontal: 16, paddingVertical: 12
    },
    name: {
        fontSize: 13, color: 'black', fontFamily: fonts.LatoBold
    },
    comment: {
        fontSize: 12, color: 'black'
    },
    inputBox: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', elevation: 3,
        borderRadius: 35, padding: 6, marginVertical: 12
    },
    input: {
        width: '80%', padding: 12
    },
    sendBtn: {
        height: 50, width: 50, borderRadius: 25, alignItems: 'center', padding: 14, backgroundColor: colours.primary,
    }
})