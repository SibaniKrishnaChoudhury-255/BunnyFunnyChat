/* @flow */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Form,Button,Item,Input,Label} from "native-base"

import Firebase from './Firebase.js'
import firebase from 'firebase'

import AsyncStorage from '@react-native-community/async-storage'

export default class RegisterPage extends Component {
  dbRef=firebase.firestore().collection('user');

  state={
    name:"",
    password:"",
    status:"",
    isloading:false
  }

  storeUser=()=>{
    if (this.state.name==='') {
        this.setState({status:"Please enter something"})
    }else {
      this.setState({isloading:true})
      this.dbRef.doc('allUsers').get().then(doc => {
        if(doc.exists){
          const  premap  = doc.data().usermap;
          const map = new Map();
          Object.keys(premap).forEach(key => {
            map.set(key, premap[key]);
          });
          map.set(this.state.name, "Free");
          let usermap = Object.fromEntries(map);
          this.dbRef.doc('allUsers').set({usermap})
            .then(() => {
              AsyncStorage.setItem('currentUserAsyncStorage', this.state.name)
              this.props.navigation.navigate('InviteFriendPage', {name: this.state.name})
              })
            .catch(error => console.log(error))
        }else{
          const map = new Map();
          map.set(this.state.name, "Free");
          let usermap = Object.fromEntries(map);
          this.dbRef.doc('allUsers').set({usermap})
            .then(() => {
              AsyncStorage.setItem('currentUserAsyncStorage', this.state.name)
              this.props.navigation.navigate('InviteFriendPage', {name: this.state.name})
              })
            .catch(error => console.log(error))
        }
        })
    }
  }


  render() {
    if (this.state.isloading) {
      return(
        <View>
            <ActivityIndicator size="large"
            color="black" />
        </View>
      )
    }
    return (
      <View style={styles.container}>
      <View style={{flex:1,flexDirection:"row",
      justifyContent:"center",marginHorizontal:200,marginVertical:50}}>

      <View style={{flex:1,justifyContent:"center"}}>
      <Image source={{uri:'https://image.freepik.com/free-vector/different-opinions-business-concept-vector_70921-257.jpg'}}
       style={{width:"100%",height:"100%"}}/>
      </View>
      <View style={{backgroundColor:"yellow",flex:1,
      justifyContent:"center"}}>
        <Form style={{marginHorizontal:30}}>

          <Item style={styles.EditTextdesign}>
            <Input
              placeholder = "Name"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={name=>this.setState({name})}>
            </Input>
          </Item>

          <Button
            style=  {{fontSize: 40,marginTop:30}}
            full
            rounded
            primary
            onPress={()=>{
              this.storeUser()
            }}>
            <Text style={{color:"white"}}>Start Chating</Text>
          </Button>

          </Form>
          <Text>{this.state.status}</Text>
      </View>
      </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"center",
    backgroundColor:"grey"
  },
  EditTextdesign:{
    backgroundColor:"white",
    marginTop:20,

  }
});
