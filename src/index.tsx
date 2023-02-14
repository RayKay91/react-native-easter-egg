import React, { ReactNode, useCallback } from 'react';

import {
  GestureDetector,
  Gesture,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

enum AxisLock {
  Y,
  X,
}

export enum Directions {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const DRAG_RESISTANCE = 4;
const INPUT_THRESHOLD = 20;
const RESET_TIMER = 20000;

const KONAMI_CODE = [
  Directions.UP,
  Directions.UP,
  Directions.DOWN,
  Directions.DOWN,
  Directions.LEFT,
  Directions.RIGHT,
  Directions.LEFT,
  Directions.RIGHT,
];

interface Props {
  children: ReactNode;
  /** @description add a custom array of inputs. Defaults to Konami code. */
  secretCode?: Directions[];
  /** @description time in ms to reset the inputs */
  resetTimer?: number;
  /** @description determines how difficult it feels to move the content in a direction */
  dragResistance?: number;
  /** @description max distance allowed for movement */
  inputThreshold?: number;
  onInputThresholdReached?: () => void;
  onCodeInputSuccess: () => void;
  onCodeInputFailure?: () => void;
  onGestureStart?: () => void;
  onGestureUpdate?: () => void;
  onGestureEnd?: () => void;
}

export function EasterEgg({
  secretCode = KONAMI_CODE,
  inputThreshold = INPUT_THRESHOLD,
  resetTimer = RESET_TIMER,
  dragResistance = DRAG_RESISTANCE,
  ...props
}: Props) {
  const y = useSharedValue(0);
  const x = useSharedValue(0);
  const lock = useSharedValue<null | AxisLock>(null);
  const inputs = useSharedValue<Directions[]>([]);

  const onStart = useCallback(
    (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      props.onGestureStart?.();

      const didStartMovingOnXAxis =
        Math.abs(e.velocityX) > Math.abs(e.velocityY);

      lock.value = didStartMovingOnXAxis ? AxisLock.X : AxisLock.Y;
      setTimeout(() => (inputs.value = []), resetTimer);
    },
    [lock, inputs, resetTimer, props]
  );
  const onUpdate = useCallback(
    (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      props.onGestureUpdate?.();

      const isInputThresholdReached = [x.value, y.value].some(
        (xY) => Math.abs(xY) > inputThreshold
      );
      if (isInputThresholdReached) {
        props.onInputThresholdReached?.();
        return;
      }

      lock.value === AxisLock.X
        ? (x.value = e.translationX / dragResistance)
        : (y.value = e.translationY / dragResistance);

      return;
    },
    [lock, x, y, inputThreshold, dragResistance, props]
  );
  const onEnd = useCallback(
    (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      props.onGestureEnd?.();

      const fingerDidGoRight = e.translationX > 0;
      const fingerDidGoDown = e.translationY > 0;

      if (lock.value === AxisLock.X) {
        inputs.value.push(
          fingerDidGoRight ? Directions.RIGHT : Directions.LEFT
        );
      } else {
        inputs.value.push(fingerDidGoDown ? Directions.DOWN : Directions.UP);
      }
      x.value = withSpring(0);
      y.value = withSpring(0);
      lock.value = null;

      if (inputs.value.length !== secretCode.length) {
        return;
      }
      let didInputCodeSuccessfully = inputs.value.every(
        (input, i) => input === secretCode[i]
      );

      didInputCodeSuccessfully
        ? props.onCodeInputSuccess()
        : props.onCodeInputFailure?.();

      inputs.value = [];
    },
    [lock, x, y, inputs, props, secretCode]
  );

  const panGesture = Gesture.Pan()
    .onStart(onStart)
    .onUpdate(onUpdate)
    .onEnd(onEnd);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }, { translateY: y.value }],
    };
  }, []);

  return (
    <GestureDetector gesture={panGesture}>
      <Reanimated.View style={animatedStyle}>{props.children}</Reanimated.View>
    </GestureDetector>
  );
}
