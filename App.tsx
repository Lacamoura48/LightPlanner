import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import InfiniteCanvas from './components/InfiniteCanvas';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
        <InfiniteCanvas />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
