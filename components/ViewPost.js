import { StyleSheet, View, Image, ScrollView, Dimensions, Animated, Modal } from 'react-native'
import React, { useRef, useState } from 'react'
import FText from './Ftext'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import useHandlePosts from '../hooks/useHandlePosts';
import { TouchableOpacity } from 'react-native';
import useUserManager from '../hooks/useUserManager';
import CommentsView from './CommentsView';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';

const { width: screenWidth } = Dimensions.get('window');

const ViewPost = ({ post }) => {

    const cardRef = useRef();

    const [commentModal, setCommentModal] = useState(false);

    const { fnLikePost } = useHandlePosts();
    const { currentUser } = useUserManager();

    const isUserLikePost = post?.likedBy?.find((userId) => userId === currentUser?.id);

    const fnOnShare = () => {
        setTimeout(async () => {
            try {
                const uri = await captureRef(cardRef, {
                    format: 'jpg',
                    quality: 0.8,
                });

                await Share.open({
                    url: uri,
                    message: post?.content
                });
            } catch (e) {
                console.log(e);
            }
        }, 500);
    };

    function formatDate(dateString) {
        const milliseconds = dateString?.seconds * 1000;
        const date = new Date(milliseconds);
        const now = new Date();
        
        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();
    
        if (isToday) {
            const diffInMs = now - date;
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
            if (diffInMinutes < 60) {
                return diffInMinutes === 0 ? "just now" : `${diffInMinutes} minutes ago`;
            } else {
                return "posted today";
            }
        }
    
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    }

    return (
        <>
            <View style={styles.mainView} >
                <View style={styles.profileBox} >
                    <Image style={styles.profileImg} source={{ uri: post?.profilePic }} />
                    <View style={{ gap: 2 }} >
                        <FText style={styles.userName}> {post?.name} </FText>
                        <FText style={styles.userEmail}> {formatDate(post?.timestamp)} </FText>
                    </View>
                </View>
                <View style={styles.postBox} >
                    <FText style={styles.content} >
                        {post?.content}
                    </FText>
                    <View>
                        <ViewShot ref={cardRef} style={{ height: 150 }} >
                            <Animated.ScrollView showsHorizontalScrollIndicator={false} style={{ flex: 1 }} horizontal={true} pagingEnabled scrollEventThrottle={16} >
                                {
                                    post?.images?.map((post) => {
                                        return (
                                            <Image style={styles.postImg} source={{ uri: post }} />
                                        )
                                    })
                                }
                            </Animated.ScrollView>
                        </ViewShot>
                        {post?.likesCount > 0 && <View style={styles.likesCountBox} >
                            <Image style={styles.likeIcon} source={require('../assets/images/like_icon.png')} />
                            <FText style={styles.likeCountTxt} >
                                {isUserLikePost && post?.likesCount == 1 ? 'You liked' : (isUserLikePost ? `You and ${post?.likesCount - 1} others liked` : `${post?.likesCount} likes`)}
                            </FText>
                        </View>}
                    </View>
                    <View style={styles.likeBox}>
                        <TouchableOpacity style={styles.iconsBox} onPress={() => fnLikePost(post?.id, currentUser?.id)} >
                            <AntDesign name={isUserLikePost ? 'like1' : 'like2'} size={22} color={isUserLikePost ? '#3570C1' : 'black'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCommentModal(true)} style={styles.iconsBox} >
                            <Octicons name='comment-discussion' size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={fnOnShare} style={styles.iconsBox} >
                            <AntDesign name='sharealt' size={22} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Modal visible={commentModal} onRequestClose={() => setCommentModal(false)} >
                <CommentsView post={post} />
            </Modal>
        </>
    )
}

export default ViewPost

const styles = StyleSheet.create({
    mainView: {
        gap: 19, marginTop: 12
    },
    profileBox: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
    },
    profileImg: {
        height: 53, width: 53, borderRadius: 26.5
    },
    userName: {
        fontSize: 15, color: '#565656', fontFamily: 'Lato-Bold'
    },
    userEmail: {
        fontSize: 12, left: 1, color: '#949494'
    },
    postBox: {
        gap: 10
    },
    postImg: {
        height: 150, width: screenWidth - 40, alignSelf: 'center', borderRadius: 4
    },
    content: {
        fontSize: 14, color: '#565656', paddingHorizontal: 4
    },
    likeBox: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20,
        borderWidth: 1, borderColor: "#F0F0F0", borderRadius: 30
    },
    likesCountBox: {
        marginTop: 4, paddingHorizontal: 2, flexDirection: 'row', alignItems: 'center', gap: 4
    },
    likeIcon: {
        height: 18, width: 18
    },
    likeCountTxt: {
        fontSize: 11
    },
    iconsBox: {
        padding: 12
    }
})