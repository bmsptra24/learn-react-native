// import { StatusBar } from 'expo-status-bar'
// import { StyleSheet, View } from 'react-native'
// import {
//   Avatar,
//   Button,
//   Card,
//   Checkbox,
//   PaperProvider,
//   MD3LightTheme,
//   Text,
// } from 'react-native-paper'
// import Tes from './components/tes'

// const LeftContent = (props: any) => <Avatar.Icon {...props} icon="folder" />

// const theme = {
//   ...MD3LightTheme,
//   colors: {
//     primary: 'rgb(120, 69, 172)',
//     onPrimary: 'rgb(255, 255, 255)',
//     primaryContainer: 'rgb(240, 219, 255)',
//     onPrimaryContainer: 'rgb(44, 0, 81)',
//     secondary: 'rgb(102, 90, 111)',
//     onSecondary: 'rgb(255, 255, 255)',
//     secondaryContainer: 'rgb(237, 221, 246)',
//     onSecondaryContainer: 'rgb(33, 24, 42)',
//     tertiary: 'rgb(128, 81, 88)',
//     onTertiary: 'rgb(255, 255, 255)',
//     tertiaryContainer: 'rgb(255, 217, 221)',
//     onTertiaryContainer: 'rgb(50, 16, 23)',
//     error: 'rgb(186, 26, 26)',
//     onError: 'rgb(255, 255, 255)',
//     errorContainer: 'rgb(255, 218, 214)',
//     onErrorContainer: 'rgb(65, 0, 2)',
//     background: 'rgb(255, 251, 255)',
//     onBackground: 'rgb(29, 27, 30)',
//     surface: 'rgb(255, 251, 255)',
//     onSurface: 'rgb(29, 27, 30)',
//     surfaceVariant: 'rgb(233, 223, 235)',
//     onSurfaceVariant: 'rgb(74, 69, 78)',
//     outline: 'rgb(124, 117, 126)',
//     outlineVariant: 'rgb(204, 196, 206)',
//     shadow: 'rgb(0, 0, 0)',
//     scrim: 'rgb(0, 0, 0)',
//     inverseSurface: 'rgb(50, 47, 51)',
//     inverseOnSurface: 'rgb(245, 239, 244)',
//     inversePrimary: 'rgb(220, 184, 255)',
//     elevation: {
//       level0: 'transparent',
//       level1: 'rgb(248, 242, 251)',
//       level2: 'rgb(244, 236, 248)',
//       level3: 'rgb(240, 231, 246)',
//       level4: 'rgb(239, 229, 245)',
//       level5: 'rgb(236, 226, 243)',
//     },
//     surfaceDisabled: 'rgba(29, 27, 30, 0.12)',
//     onSurfaceDisabled: 'rgba(29, 27, 30, 0.38)',
//     backdrop: 'rgba(51, 47, 55, 0.4)',
//   },
// }

// export default function App() {
//   return (
//     <PaperProvider theme={theme}>
//       <Tes />
//     </PaperProvider>
//   )
// }

import { useState, useEffect, useRef } from 'react'
import { Text, View, Button, Platform } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  }

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
}

async function registerForPushNotificationsAsync() {
  let token

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })
    console.log(token)
  } else {
    alert('Must use physical device for Push Notifications')
  }

  return token.data
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification)
      },
    )

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response)
      },
    )

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return (
    <View
      style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}
    >
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>
          Title: {notification && notification.request.content.title}{' '}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{' '}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken)
        }}
      />
    </View>
  )
}
