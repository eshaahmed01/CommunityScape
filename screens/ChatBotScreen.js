import { Button, Image, Keyboard, Linking, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { colours } from '../constants/colours';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { intents } from '../constants/chatBotIntents';

const ChatBotScreen = () => {

  const allQuestions = [
    "Hi What's your name ?",
    "Explain your problems",
    "ok we will contact later, have a nice day GoodBye..."
  ];

  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const [chatMsgs, setChatMsgs] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => { fnGetLocalChat(); fnScrollToBottom(); }, []);

  useEffect(() => { fnSetLocalChat() }, [chatMsgs]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      fnScrollToBottom();
    });
    return () => { keyboardDidShowListener.remove() };
  }, []);

  const fnSetLocalChat = async () => {
    await AsyncStorage.setItem('chat', JSON.stringify(chatMsgs));

  };

  const fnGetLocalChat = async () => {
    const savedChat = await AsyncStorage.getItem('chat');
    const parsedChat = JSON.parse(savedChat) ?? [];
    if (parsedChat?.length < 1) {
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        setChatMsgs((pre) => [...pre, { isBot: 'Hi! Welcome to our property service chat. How can I help you?' }]);
      }, 2000);
    } else {
      setChatMsgs(parsedChat);
    }
  };

  const fnGetBotMsg = (userInput) => {
    for (let intent of intents) {
      for (let keyword of intent.keywords) {
        if (userInput.toLowerCase().includes(keyword)) {
          return intent.response;
        }
      }
    }
    return "please contact on this number 03175655729 if you want more details";
  };


  const fnSendMsg = () => {

    fnScrollToBottom();
    setChatMsgs((pre) => [...pre, { isUser: userInput }]);
    const botResponse = fnGetBotMsg(userInput);
    setUserInput("");

    setTimeout(() => { setLoader(true); fnScrollToBottom(); }, 1000);

    setTimeout(() => {
      setLoader(false);
      setChatMsgs((pre) => [...pre, { isBot: botResponse }]);
      fnScrollToBottom()
    }, 3000);

  };

  const fnScrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: 'white' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconBox}>
          <Ionicons color={'white'} size={22} name='chevron-back' />
        </TouchableOpacity>
        <Image style={styles.robotImg} source={require('../assets/images/robot.png')} />
      </View>
      <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps='always' style={{ flex: 1, paddingHorizontal: 12, marginBottom: 10 }}>
        {
          chatMsgs?.map((chat) => {
            return (
              <View>
                {chat?.isBot && <View style={styles.botMsgBox}>
                  {/* <Text onPress={()=> { chat?.isBot?.includes('03175655729') && Linking.openURL('tel:03175655729') }} style={styles.botMsgTxt}>
                    {chat.isBot}
                  </Text> */}
                  <Text style={styles.botMsgTxt}>
                    {chat.isBot.includes('03175655729') ? (
                      <>
                        {chat.isBot.split('03175655729')[0]} {/* Text before the phone number */}
                        <Text
                          style={[styles.botMsgTxt, { textDecorationLine: 'underline', color: '#0E86D4' }]}
                          onPress={() => Linking.openURL('tel:03175655729')}
                        >
                          03175655729
                        </Text>
                        {chat.isBot.split('03175655729')[1]} {/* Text after the phone number */}
                      </>
                    ) : (
                      chat.isBot
                    )}
                  </Text>
                </View>}
                {chat?.isUser && <View style={styles.userMsgBox}>
                  <Text style={styles.userMsgTxt} >
                    {chat?.isUser}
                  </Text>
                </View>}
              </View>
            )
          })
        }
        {loader && <View>
          <LottieView autoPlay source={require('../assets/animations/typing_loader.json')} height={70} width={70} />
        </View>}
      </ScrollView>
      <View style={styles.inputBox}>
        <TextInput style={styles.input} placeholder='Write' value={userInput} onChangeText={(text) => setUserInput(text)} />
        <TouchableOpacity disabled={!userInput} style={styles.sendIconBox} onPress={fnSendMsg}>
          <Ionicons name='send' color={colours.primary} size={22} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ChatBotScreen

const styles = StyleSheet.create({
  header: {
    backgroundColor: colours.primary, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  robotImg: {
    height: 40, width: 40
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