import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  PaperProvider,
  MD3LightTheme,
  Text,
} from 'react-native-paper'
import DrawerComponent from './Drawer'

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="folder" />

const Tes = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'red',
        }}
      >
        <DrawerComponent />
      </View>
      <Text variant="titleLarge">
        Open up App.tsx to start working on your app!
      </Text>
      <StatusBar style="auto" />
      <Button
        icon="camera"
        mode="contained"
        style={{ backgroundColor: 'red' }}
        onPress={() => console.log('Pressed')}
      >
        Press me
      </Button>
      <Card>
        <Card.Title
          title="Card Title"
          subtitle="Card Subtitle"
          left={LeftContent}
        />
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        <Card.Actions>
          <Button>Cancel</Button>
          <Button>Ok</Button>
        </Card.Actions>
      </Card>
      <Checkbox status={'checked'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Tes
