/* @flow */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import {Button,Item,Input,Form,Toast} from "native-base"
import { ListItem } from 'react-native-elements'
import Firebase from './Firebase.js'
import firebase from 'firebase'
import firestore from 'firebase/firestore'

import AsyncStorage from '@react-native-community/async-storage'


export default class InviteFriendPage extends Component {

  constructor() {
    super();
    this.friendListRef = firebase.firestore().collection('userFriendList');
    this.userNameRef=firebase.firestore().collection('user');
    this.state = {
      isLoading: true,
      userArr: [],
      searchedFriend: '',
      currentUser: '',
    };
  }

  async componentWillMount() {
    try{
      const value = await AsyncStorage.getItem('currentUserAsyncStorage')
      if(value !== null){
        this.setState({currentUser: value})
      }else{
        this.props.navigation.replace("RegisterPage")
      }
    } catch(e) {}
  }

  getData = async () => {
    try{
      const value = await AsyncStorage.getItem('currentUserAsyncStorage')
      if(value !== null){
        this.setState({currentUser: value})
      }else{
        this.props.navigation.replace("RegisterPage")
      }
    } catch(e) {}
  }


  async componentDidMount() {
    try{
      const value = await AsyncStorage.getItem('currentUserAsyncStorage')
      if(value !== null){
        this.setState({currentUser: value})
        this.friendListRef.doc(this.state.currentUser).get().then(doc => {
          if(doc.exists){
            let alllist = doc.data().friendList;
            const userArr = []
            Object.keys(alllist).forEach(friend => {
              userArr.push(alllist[friend])
            });
            this.setState({userArr, isLoading: false})
          }
          })
          .catch(error => console.log(error))
      }
    } catch(e) {}
  }

  loadScreen = () => {
    if(this.state.isLoading){
      return(
      <View>
        <ActivityIndicator size="large" color="#9E9E9E"/>
      </View>
      )
    }else{
      return(
      <ScrollView>{
        this.state.userArr.map((item, i) => {
          return (
            <ListItem
              key={i}
              chevron
              bottomDivider
              title={item}
              // rightTitle= "Free"
              // rightTitleStyle={{color: 'blue'}}
              onPress={() => {
                this.props.navigation.navigate('ChatPage', {
                  friendName: item,
                  currentUser: this.state.currentUser
              });
            }}/>
          );
        }

      )
    }</ScrollView>
    )
  }
}

validateAndAddFriend = () => {
  const ref = this;
  this.userNameRef.doc('allUsers').get().then(doc => {
      if(doc.exists){
        const  premap  = doc.data().usermap;
        const checkFriend = ref.state.searchedFriend

        if(checkFriend in premap){
          ref.friendListRef.doc(this.state.currentUser).get().then(doc => {
            if(doc.exists){
              const data = doc.data().friendList;
              const list = []
              Object.keys(data).forEach(key => {
                list.push(data[key]);
              });
              list.push(checkFriend)
              let friendList = Object.assign({}, list);
              ref.friendListRef.doc(this.state.currentUser).set({friendList})
            }else{
              const list = []
              list.push(checkFriend)
              let friendList = Object.assign({}, list);
              ref.friendListRef.doc(this.state.currentUser).set({friendList})
            }
          })
          .catch(error => console.log(error))

          const userArr = ref.state.userArr
          userArr.push(checkFriend)

          ref.setState({userArr, searchedFriend: ''})

        }else{
          Toast.show({
            text: 'Please write correct friend name!!!',
            buttonText: 'Got it',
            position: 'top',
            style: {width: "50%"}
          })
        }
      }
  })
    .catch(error => console.log(error))
}

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.chatlistDesign}>
            {this.loadScreen()}
          </View>
          <View style={styles.searchItemDesign}>
            <Form>
            <Item style={styles.EditTextdesign}>
            <Input
              placeholder = "Search friend name..."
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText = {searchedFriend => this.setState({searchedFriend})}
              >
            </Input>
            </Item>

            <Button
              style=  {{fontSize: 40,marginTop:30,marginHorizontal:50}}
              full
              rounded
              primary
              onPress = { () =>  {
                if(this.state.searchedFriend !== this.state.currentUser){
                  this.validateAndAddFriend()
                }else{
                  Toast.show({
                    text: 'Please enter friend name...',
                    buttonText: 'Got it',
                    position: 'top',
                    style: {width: "50%"}
                  })
                }
              }}
            >
              <Text style={{color:"white"}}>Add Friend</Text>
            </Button>

            </Form>
          </View>
      </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row:{
    flex:1,
    flexDirection:"row",
    margin:50
  },
  chatlistDesign:{
    flex:2,
    backgroundColor:"black"
  },
  searchItemDesign:{
    flex:1,
    backgroundColor:"orange",
    justifyContent:"center",

  },EditTextdesign:{
      marginHorizontal:50,
      backgroundColor:"white",
  }
});
