import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

const ObjectActionsMenu = ({updateRotation, deleteObject}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={deleteObject}></TouchableOpacity>
      <TouchableOpacity
        style={styles.rotateButton}
        onPress={updateRotation}></TouchableOpacity>
    </View>
  );
};

export default ObjectActionsMenu;

const styles = StyleSheet.create({
  addButton: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    backgroundColor: 'red',
    borderRadius: 50,
  },
  rotateButton: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    backgroundColor: 'orange',
    borderRadius: 50,
  },
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 20,
    gap: 10,
  },
});
