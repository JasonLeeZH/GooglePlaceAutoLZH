/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from './src/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const AppOuter = () => (
  <SafeAreaProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </SafeAreaProvider>
);

AppRegistry.registerComponent(appName, () => AppOuter);
