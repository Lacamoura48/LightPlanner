import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

const Line = ({
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

  const scale = useSharedValue(100);
  const scaleOffset = useSharedValue(0);

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
        if (rotated) {
          scaleOffset.value = roundToNearest5(e.translationY);
        } else {
          scaleOffset.value = roundToNearest5(e.translationX);
        }
      }
    })
    .onFinalize(() => {
      scale.value =
        scale.value + scaleOffset.value >= 20
          ? scale.value + scaleOffset.value
          : 20;
      scaleOffset.value = 0;
    });
  const tap = Gesture.Tap().onStart(selectHandler).maxDuration(250);

  const animatedStyles = useAnimatedStyle(() => ({
    left: translateX.value + offsetX.value,
    top: translateY.value + offsetY.value,
    backgroundColor: selected ? 'yellow' : 'orange',
    width: rotated ? 5 : scale.value + scaleOffset.value,
    height: rotated ? scale.value + scaleOffset.value : 5,
    position: 'absolute',
  }));
  const panHandleAnimatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: rotated ? -12 : (scale.value / 2) - 12,
    bottom: rotated ? (scale.value / 2) - 12 : -12,
  }));

  const styles = StyleSheet.create({
    scaleHandle: {
      height: 30,
      width: 30,
      backgroundColor: 'gray',
      borderRadius: 60,
      position: 'absolute',
      right: -15,
      bottom: -12,
    },
    panHandle: {
      height: 30,
      width: 30,
      backgroundColor: 'yellow',
      borderRadius: 60
    },
  });
  useDerivedValue(
    () => runOnJS(positionHandler)({x: translateX.value, y: translateY.value}),
    [translateX.value, translateY.value],
  );
  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[animatedStyles]}>
        {selected && (
          <>
            <GestureDetector gesture={scalePan}>
              <View style={styles.scaleHandle}></View>
            </GestureDetector>
            <GestureDetector gesture={pan}>
              <Animated.View style={[panHandleAnimatedStyle,styles.panHandle ]}></Animated.View>
            </GestureDetector>
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

export default Line;
