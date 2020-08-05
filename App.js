import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Root } from "native-base";


import InviteFriendPage from './screens/InviteFriendPage';
import RegisterPage from './screens/RegisterPage';
import ChatPage from './screens/ChatPage';

const Stack = createStackNavigator();

export default function App() {
  return (
     <Root>
        <NavigationContainer>
            <Stack.Navigator  intialRouteName="InviteFriendPage"
              >
              <Stack.Screen
                name="InviteFriendPage"
                component={InviteFriendPage}
                options={{ title: 'Invite Friend',headerShown: true}}
              />

              <Stack.Screen
                name="RegisterPage"
                component={RegisterPage}
                options={{ title: 'Create Account' ,headerShown:false}}
              />

              <Stack.Screen
                name="ChatPage"
                component={ChatPage}
                options={{ title: 'Create Account' ,headerShown:false}}
              />

            </Stack.Navigator>
        </NavigationContainer>
    </Root>
  );
}
