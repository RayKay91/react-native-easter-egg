# react-native-easter-egg

A fun little easter egg to include in your app. A component that accepts gestures and will match them to a secret code for your users to input.

## Installation

```sh
npm install react-native-easter-egg
```

## Usage

Import the `<EasterEgg />` component and wrap your component with it. It will allow it to move along the vertical and horizontal planes. It accepts a number of props which will allow you to customise it to your needs.

| Prop                    | Default                                                                                                                                   | Description                                                                                                                                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onCodeInputSuccess      | N/A                                                                                                                                       | A function that will be executed when the user inputs match the secret code. **REQUIRED**                                                                                                                         |
| onCodeInputFailure      | N/A                                                                                                                                       | A function that will be executed when the user inputs match the length of the secret code, but don't match the code exactly.                                                                                      |
| onGestureStart          | N/A                                                                                                                                       | A function that will be executed when the pan gesture starts.                                                                                                                                                     |
| onGestureUpdate         | N/A                                                                                                                                       | A function that will be executed as the pan gesture updates on finger movement.                                                                                                                                   |
| onGestureEnd            | N/A                                                                                                                                       | A function that will be executed when the user lifts their finger from the screen.                                                                                                                                |
| inputThreshold          | 20                                                                                                                                        | The max number of pixels the user can move the component. Beyond this point moving the finger won't move the component.                                                                                           |
| onInputThresholdReached | N/A                                                                                                                                       | A function that will be executed everytime the pan gesture continues after reaching the `inputThreshold`                                                                                                          |
| dragResistance          | 4                                                                                                                                         | Determines how difficult it feels to move the content in a direction. The higher the number the more difficult it will feel.                                                                                      |
| resetTimer              | 20000                                                                                                                                     | The time in ms that it will take to reset the user inputs. After the timeout the user can enter the gestures again. Or they can unmount and remount the component by navigating away or something.                |
| secretCode              | [ Directions.UP, Directions.UP, Directions.DOWN, Directions.DOWN, Directions.LEFT, Directions.RIGHT, Directions.LEFT, Directions.RIGHT, ] | The secret code that the user must match with their inputs. Defaults to the Konami code. You can import the `Directions` enum and create your own custom array of directions for a more personalised secret code. |

Since this package relies on react-native-gesture-handler and react-native-reanimated please see the installation instructions for those if you're getting errors. The gesture handler for example requires that the app be wrapped in a `<GestureHandlerRootView />`.

```tsx
import { EasterEgg } from 'react-native-easter-egg';

function App() {
  return (
    <EasterEgg onCodeInputSuccess={() => Alert.alert('Hello')}>
      <YourComponent />
    </EasterEgg>
  );
}
```

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
