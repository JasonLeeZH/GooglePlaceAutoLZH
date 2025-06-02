import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface IconClickProps {
  onPressAction: () => any;
  icon: ImageSourcePropType;
}

const IconClick = (props: IconClickProps) => {
  const styles = useStyles;

  return (
    <TouchableOpacity onPress={props.onPressAction}>
      <Image style={styles.icon} source={props.icon} />
    </TouchableOpacity>
  );
};

const useStyles = StyleSheet.create({
  icon: {width: 20, height: 20},
});

export default IconClick;
