import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import CreateNewNoteScreen from './components/CreateNewNoteScreen';
import Styles from './Styles';
import DefaultTitlebar from './components/base/DefaultTitlebar';
import Environment from './Environment';
import StringResources from './StringResources';

const stack = createNativeStackNavigator();

const defaultScreenOptions = (opts) => {
  return {
    statusBarColor: Styles.background1,
    headerTintColor: Styles.foreground2,
    headerStyle: {
      backgroundColor: Styles.background1
    },
    headerTitle: (props) => <DefaultTitlebar {...props} title={opts.title} />
  }
}

export default function App() {
  console.log("app locale: " + Environment.locale);
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="Home" options={{ ...defaultScreenOptions({ title: StringResources.get("title.notes") }) }} component={HomeScreen} />
        <stack.Screen name="CreateNote" options={{ ...defaultScreenOptions({ title: StringResources.get("title.create") }) }} component={CreateNewNoteScreen} />
      </stack.Navigator>
    </NavigationContainer>
  );
}
