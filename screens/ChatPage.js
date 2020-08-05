/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';

import Firebase from './Firebase'
import firebase from 'firebase'
import firestore from 'firebase/firestore'

export default class ChatPage extends Component {

  state={
    messages: [],
    chatRef: '',
  }

  // componentWillMount(){
  //   //shared pref
  //   let name = this.props.route.params.name;
  //   JSON.stringify(name)
  //   firebase.firestore().collection('user').doc("allUsers").update({
  //       'usermap.`${name}`' : 'busy'
  //   })
  // }

  get user(){
    return{
      _id:this.props.route.params.currentUser
    };
  }

  get ref(){
    return this.state.chatRef
  }

  parse=snapshot=>{
    const{text,user}=snapshot.val();
    const{key:_id}=snapshot;
    const message={_id,text,user};
    return message;
  }

on= callback=>{
    let context = this
    let mainRef = firebase.database().ref("message")
    mainRef.once("value").then(function(snapshot) {
        if(snapshot.hasChild(context.props.route.params.friendName + "@"
                        + context.props.route.params.currentUser)){
          context.setState({chatRef: mainRef.child(context.props.route.params.friendName + "@"
                        + context.props.route.params.currentUser)})
        }else{
          context.setState({chatRef: mainRef.child(context.props.route.params.currentUser + "@" + context.props.route.params.friendName)})
        }

        context.state.chatRef.on('child_added',
        snapshot=>callback(context.parse(snapshot)))

    });
  }

  randomNumber=(no_ofWords)=>{
    return Math.floor(Math.random() * no_ofWords)
  }

  send=messages=>{
    let context = this;
    let wordLen = messages[0].text.split(' ').length
    if(wordLen > 7){
      wordLen = 7
    }
    let ranMsgRef = firebase.firestore().collection("randomMessages").doc(wordLen+"")

    ranMsgRef.get()
    .then(snapshot => {
      let allWord = snapshot.data().words
      let randomKey = context.randomNumber(allWord.length)
      messages[0].text = allWord[randomKey]

      for(let i=0;i<messages.length;i++){
        const{text,user} =messages[i];
        const message={
          text,user
        };

        context.append(message);
      }
    })
    .catch(error => console.log(error))
  }

  append = message =>this.ref.push(message);

  off(){
    this.ref.off();
  }

  componentDidMount(){
    this.on(message=>
      this.setState(previousState=>({
        messages:GiftedChat.append(previousState.messages,message)
      }))
    )
  }


//////////  Not working may work in mobile because in web its not showing back button to go back and unmount ///////
  componentWillUnmount(){
    let context = this
    let mainRef = firebase.database().ref("message")
    mainRef.once("value").then(function(snapshot) {
        if(snapshot.hasChild(context.props.route.params.friendName + "@"
                        + context.props.route.params.currentUser)){
          mainRef.child(context.props.route.params.friendName + "@" + context.props.route.params.currentUser)
            .remove()
        }else{
          mainRef.child(context.props.route.params.currentUser + "@" + context.props.route.params.friendName)
            .remove()
        }

    });
  }

  render() {
    return (
      <GiftedChat
       messages={this.state.messages}
       user={this.user}
       onSend={this.send}
       />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
