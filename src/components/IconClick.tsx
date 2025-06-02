import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface IconClickProps {
  icon: ImageSourcePropType;
  onPressAction?: () => void;
}

const IconClick = (props: IconClickProps) => {
  const styles = useStyles;

  const imageBody = () => {
    return <Image style={styles.icon} source={props.icon} />;
  };

  return props.onPressAction !== undefined ? (
    <TouchableOpacity onPress={props.onPressAction}>
      {imageBody()}
    </TouchableOpacity>
  ) : (
    imageBody()
  );
};

const useStyles = StyleSheet.create({
  icon: { width: 20, height: 20 },
});

export default IconClick;
