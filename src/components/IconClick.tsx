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
  return (
    <TouchableOpacity onPress={props.onPressAction}>
      <Image style={useStyles.icon} source={props.icon} />
    </TouchableOpacity>
  );
};

const useStyles = StyleSheet.create({
  icon: {width: 20, height: 20},
});

export default IconClick;
