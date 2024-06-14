import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg from 'react-native-svg';
import Rectangle from './Rectangle';

const InfiniteCanvas = () => {
  const scale = useSharedValue(1);
  const scaleOffset = useSharedValue(0);
  const objectsDataToSubmit = useRef([{x: 10, y: 10, id: 1}]);
  const [pressedObject, setPressedObject] = useState();
  const objectPressHandler = id => {
    setPressedObject(id);
  };
  const clearPressed = () => {
    setPressedObject(undefined);
  };
  const updateObjectPosition = (coordinations, id) => {
    const objectToChange = objectsDataToSubmit.current.find(
      item => item.id === id,
    );
    if (objectToChange) {
      objectToChange.x = coordinations.x;
      objectToChange.y = coordinations.y;
      objectsDataToSubmit.current.map(item =>
        item.id === id ? objectToChange : item,
      );
    }
  };
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const [objectsData, setObjectsData] = useState([{x: 10, y: 10, id: 1}]);
  function addObject() {
    setObjectsData(p => [...p, {x: 10, y: 10, id: p.length + 1}]);
  }
  const pinch = Gesture.Pinch()
    .onChange(e => {
      scaleOffset.value = e.scale - 1;
    })
    .onFinalize(e => {
      scale.value = scaleOffset.value + scale.value;
      scaleOffset.value = 0;
      if (scale.value < 0.5) scale.value = withSpring(0.5);
    });
  const pan = Gesture.Pan()
    .onChange(e => {
      offsetX.value = e.translationX;
      offsetY.value = e.translationY;
    })
    .onFinalize(() => {
      translateX.value = translateX.value + offsetX.value;
      translateY.value = translateY.value + offsetY.value;
      offsetX.value = 0;
      offsetY.value = 0;
    });
  const tap = Gesture.Tap().onStart(clearPressed).maxDuration(250);
  const canvasGesture = Gesture.Simultaneous(pinch, pan, tap);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value + scaleOffset.value},
      {translateX: translateX.value + offsetX.value},
      {translateY: translateY.value + offsetY.value},
    ],
  }));
  useEffect(() => {
    objectsDataToSubmit.current = objectsData;
  }, []);
  return (
    <View style={styles.container}>
      <GestureDetector gesture={canvasGesture}>
        <Animated.View style={[styles.flex, animatedStyles]}>
          {objectsData.length > 0 ? (
            <Svg height="100%" width="100%">
              {objectsData.map((object, index) => (
                <Rectangle
                  selectHandler={() => objectPressHandler(object.id)}
                  positionHandler={coordinations =>
                    updateObjectPosition(coordinations, object.id)
                  }
                  selected={pressedObject === object.id}
                  key={index}
                  x={object.x}
                  y={object.y}
                />
              ))}
            </Svg>
          ) : (
            <View />
          )}
        </Animated.View>
      </GestureDetector>
      <TouchableHighlight style={styles.addButton} onPress={addObject}>
        <Text style={{color: 'white'}}>+ Rectangle</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  flex: {
    width: 1200,
    height: 1200,
    transform: [{scale: 2.5}],
    backgroundColor: 'white',
  },
  addButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: 10,
    left: 200,
  },
});

export default InfiniteCanvas;
