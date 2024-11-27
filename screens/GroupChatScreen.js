import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { db } from '../firebaseconfig';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { colours } from '../constants/colours';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useUserManager from '../hooks/useUserManager';

const GroupChatScreen = () => {

    const route = useRoute();
    const scrollViewRef = useRef(null);
    const navigation = useNavigation();
    const { currentUser } = useUserManager();

    const user = currentUser;
    const group = route?.params?.group ?? null;
    const userId = user?.id;
    const groupId = group?.id;

    const [allMessages, setAllMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loader, setLoader] = useState(false);

    useEffect(() => { setLoader(true); listenToMessages(); }, [currentUser]);

    const fnOnSubmitMessage = async () => {
        fnScrollToBottom();
        setMessage("");
        fnSendMessage();
    };

    const fnSendMessage = async () => {
        try {
            const messageData = {
                senderId: userId,
                message,
                name: user?.fullName,
                email: user?.email,
                image: user?.profilePic,
                timestamp: serverTimestamp()
            };
            const messagesRef = collection(db, "groups", groupId, "messages");
            await addDoc(messagesRef, messageData);

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const listenToMessages = () => {
        try {
            const messagesRef = collection(db, "groups", groupId, "messages");
            const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

            const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
                const messages = snapshot.docs?.map((doc) => ({ id: doc.id, ...doc.data() }));
                setTimeout(() => {
                    setLoader(false);
                    setAllMessages(messages);
                    fnScrollToBottom();
                }, 1000);
            });

            return unsubscribe;
        } catch (error) {
            console.error("Error listening to messages:", error);
        }
    };

    const fnScrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const fnNavigateToGroupDetails = () => {
        navigation.navigate('GroupDetails', { group });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: 'white' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconBox}>
                    <Ionicons color={'white'} size={22} name='chevron-back' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => fnNavigateToGroupDetails()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Image style={styles.robotImg} source={{ uri: group?.image }} />
                    <Text style={{ color: 'white' }} >
                        {group?.name}
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps='always' contentContainerStyle={{flexGrow : 1}}  style={{ flex: 1, paddingHorizontal: 12, marginBottom: 10 }}>
                {loader ?
                    <View style={{ flex: 0.9, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size={'large'} color={colours.primary} />
                    </View>
                    : allMessages?.length > 0 &&
                    allMessages?.map((chat) => {
                        return (
                            <View>
                                {chat?.senderId == userId ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <View style={styles.userMsgBox}>
                                                <Text style={styles.userMsgTxt} >
                                                    {chat?.message}
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 9, top: 2, color: colours.primary }}>{chat?.name}</Text>
                                        </View>
                                        <Image style={{ height: 34, width: 34, borderRadius: 17 }} source={{ uri: chat?.image }} />
                                    </View>
                                    : <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Image style={{ height: 34, width: 34, borderRadius: 17 }} source={{ uri: chat?.image }} />
                                        <View style={{ flex: 1 }}>
                                            <View style={styles.botMsgBox}>
                                                <Text style={styles.botMsgTxt} >
                                                    {chat?.message}
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 9, top: 2, color: colours.primary }}>{chat?.name}</Text>
                                        </View>
                                    </View>}
                            </View>
                        )
                    })
                }
            </ScrollView>
            <View style={styles.inputBox}>
                <TextInput style={styles.input} placeholder='Write' value={message} onChangeText={(text) => setMessage(text)} />
                <TouchableOpacity disabled={!message} style={styles.sendIconBox} onPress={fnOnSubmitMessage}>
                    <Ionicons name='send' color={colours.primary} size={22} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default GroupChatScreen;

const styles = StyleSheet.create({
    header: {
        backgroundColor: colours.primary, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 10,
        flexDirection: 'row', alignItems: 'center', gap: 6,
    },
    robotImg: {
        height: 40, width: 40, borderRadius: 20
    },
    backIconBox: {
        padding: 6, top: 4
    },
    botMsgBox: {
        backgroundColor: '#ECECEC', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, maxWidth: '70%', alignSelf: 'flex-start',
        marginTop: 10,
    },
    userMsgBox: {
        backgroundColor: colours.primary, paddingHorizontal: 12, paddingVertical: 10, alignSelf: 'flex-end', borderRadius: 8,
        maxWidth: '70%', marginTop: 10,
    },
    userMsgTxt: {
        color: 'white',
    },
    botMsgTxt: {
        color: colours.primary,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: '85%', padding: 16,
    },
    sendIconBox: {
        padding: 18
    }
})