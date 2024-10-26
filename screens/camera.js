import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  ViroImage,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";

const HelloWorldSceneAR = () => {
  const [text, setText] = useState("Initializing AR...");

  // Handle AR tracking state updates
  function onInitialized(state, reason) {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText("Your Home 3D model is loading..."); // Updated text
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking if needed
      setText("Tracking unavailable");
    }
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {/* Centered text */}
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]} // Adjust position if needed
        style={styles.helloWorldTextStyle}
      />
      {/* Centered image */}
      <ViroImage
        source={require('../assets/11049420.png')} // Update the path to your image
        scale={[0.5, 0.5, 0.5]} // Adjust scale as needed
        position={[0, -0.5, -1]} // Position to center the image
        rotation={[0, 0, 0]} // No rotation needed
      />
    </ViroARScene>
  );
};

const ARModelScreen = () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

export default ARModelScreen;

const styles = StyleSheet.create({
  f1: { flex: 1 },
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});