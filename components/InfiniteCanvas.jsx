import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg from 'react-native-svg';
import Rectangle from './objects/Rectangle';
import Line from './objects/Line';
import Asset from './objects/Asset';
import ObjectActionsMenu from './menu/ObjectActionsMenu';

const InfiniteCanvas = () => {
  const {width, height} = Dimensions.get('window');
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
      const tempObject = {...objectToChange};
      tempObject.x = coordinations.x;
      tempObject.y = coordinations.y;
      objectsDataToSubmit.current.map(item =>
        item.id === id ? tempObject : item,
      );
    }
  };
  const updateRotation = id => {
    const objectToChange = objectsData.find(item => item.id === id);
    if (objectToChange?.type === 'line') {
      const tempObject = {...objectToChange};
      tempObject.rotation = tempObject.rotation ? false : true;
      setObjectsData(p => p.map(item => (item.id === id ? tempObject : item)));
    } else if (objectToChange?.type === 'asset') {
      const tempObject = {...objectToChange};
      tempObject.rotation = tempObject.rotation
        ? tempObject.rotation === 3
          ? 0
          : tempObject.rotation + 1
        : 1;
      setObjectsData(p => p.map(item => (item.id === id ? tempObject : item)));
    }
  };
  const deleteObject = () => {
    setObjectsData((prevItems) => prevItems.filter(item => item.id !== pressedObject));
  };
  const translateX = useSharedValue(-600 + width / 2);
  const translateY = useSharedValue(-600 + height / 2);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const [objectsData, setObjectsData] = useState([
    {x: 550, y: 550, id: 1, type: 'asset'},
  ]);
  function addObject(type) {
    setObjectsData(p => [
      ...p,
      {
        x: -translateX.value + width / 2 - 50,
        y: -translateY.value + height / 2 - 50,
        id: p.length + 1,
        type: type,
      },
    ]);
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
              {objectsData.map((object, index) =>
                object.type === 'rect' ? (
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
                ) : object.type === 'line' ? (
                  <Line
                    selectHandler={() => objectPressHandler(object.id)}
                    positionHandler={coordinations =>
                      updateObjectPosition(coordinations, object.id)
                    }
                    rotationHandler={() => updateRotation(object.id)}
                    rotated={object.rotation}
                    selected={pressedObject === object.id}
                    key={index}
                    x={object.x}
                    y={object.y}
                  />
                ) : (
                  <Asset
                    selectHandler={() => objectPressHandler(object.id)}
                    positionHandler={coordinations =>
                      updateObjectPosition(coordinations, object.id)
                    }
                    selected={pressedObject === object.id}
                    key={index}
                    rotated={object.rotation}
                    x={object.x}
                    y={object.y}
                  />
                ),
              )}
            </Svg>
          ) : (
            <View />
          )}
        </Animated.View>
      </GestureDetector>
      <View style={styles.buttonsContainer}>
        <TouchableHighlight
          style={styles.addButton}
          onPress={() => addObject('rect')}>
          <Text style={{color: 'white'}}>+ Rectangle</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.addButton}
          onPress={() => addObject('line')}>
          <Text style={{color: 'white'}}>+ Ligne</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.addButton}
          onPress={() => addObject('asset')}>
          <Text style={{color: 'white'}}>+ asset</Text>
        </TouchableHighlight>
      </View>
      {pressedObject && <ObjectActionsMenu updateRotation={() => updateRotation(pressedObject)} deleteObject={deleteObject} />}
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
    backgroundColor: 'white',
  },
  addButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    alignSelf: 'center',
    backgroundColor: 'blue',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
  },
});

export default InfiniteCanvas;
