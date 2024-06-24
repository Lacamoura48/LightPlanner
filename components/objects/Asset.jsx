import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

const Asset = ({
  x,
  y,
  selectHandler,
  selected,
  positionHandler,
  sizeHandler,
  rotated,
}) => {
  // const pressed = useSharedValue(selected);
  const translateX = useSharedValue(x);
  const translateY = useSharedValue(y);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const scaleX = useSharedValue(100);
  const scaleY = useSharedValue(100);
  const scaleOffsetX = useSharedValue(0);
  const scaleOffsetY = useSharedValue(0);

  function onPositionHandler() {
    positionHandler({x: translateX.value, y: translateY.value});
    // setCoords({x: translateX.value, y: translateY.value});
  }
  function onSizeHandler() {
    positionHandler({scaleX: scaleX.value, scaleY: scaleY.value});
  }

  const roundToNearest5 = value => {
    'worklet';
    return Math.round(value / 10) * 10;
  };
  const pan = selected
    ? Gesture.Pan()
        .onChange(e => {
          if (selected) {
            offsetX.value = roundToNearest5(e.translationX);
            offsetY.value = roundToNearest5(e.translationY);
          }
        })
        .onFinalize(() => {
          translateX.value = translateX.value + offsetX.value;
          translateY.value = translateY.value + offsetY.value;
          offsetX.value = 0;
          offsetY.value = 0;
        })
    : Gesture.Native();
  const scalePan = Gesture.Pan()
    .onChange(e => {
      if (selected) {
        scaleOffsetX.value = roundToNearest5(e.translationX);
        scaleOffsetY.value = roundToNearest5(e.translationY);
      }
    })
    .onFinalize(() => {
      scaleX.value =
        scaleX.value + scaleOffsetX.value >= 0
          ? scaleX.value + scaleOffsetX.value
          : 0;
      scaleY.value =
        scaleY.value + scaleOffsetY.value >= 0
          ? scaleY.value + scaleOffsetY.value
          : 0;
      scaleOffsetX.value = 0;
      scaleOffsetY.value = 0;
    });
  const tap = Gesture.Tap().onStart(selectHandler).maxDuration(250);

  const animatedStyles = useAnimatedStyle(() => ({
    left: translateX.value + offsetX.value,
    top: translateY.value + offsetY.value,
    borderWidth: selected ? 1 : 0,
    borderColor: 'orange',
    width: scaleX.value + scaleOffsetX.value,
    height: scaleY.value + scaleOffsetY.value,
    position: 'absolute',
  }));
  function getRotation(num) {
    'worklet';
    const rotations = ['0deg', '90deg', '180deg', '270deg'];
    return rotations[num || 0];
  }
  const imageStyles = useAnimatedStyle(() => ({
    transform: [{rotate: getRotation(rotated)}],
  }));
  const assetGesture = Gesture.Simultaneous(pan, tap);
  useDerivedValue(
    () => runOnJS(positionHandler)({x: translateX.value, y: translateY.value}),
    [translateX.value, translateY.value],
  );
  return (
    <GestureDetector gesture={assetGesture}>
      <Animated.View style={[animatedStyles]}>
        <Animated.Image
          source={require('../../assets/bed.png')}
          style={[styles.imageStyles, imageStyles]}
          resizeMode="contain"
        />
        {selected && (
          <GestureDetector gesture={scalePan}>
            <View style={styles.scaleHandle}></View>
          </GestureDetector>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

export default Asset;

const styles = StyleSheet.create({
  scaleHandle: {
    height: 30,
    width: 30,
    backgroundColor: 'gray',
    borderRadius: 60,
    position: 'absolute',
    right: -15,
    bottom: -15,
  },
  imageStyles: {
    width: '100%',
    height: '100%',
  },
});
