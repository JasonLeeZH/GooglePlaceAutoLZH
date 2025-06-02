import {Input} from '@ant-design/react-native';
import React from 'react';
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TextInputChangeEventData,
  TextInputEndEditingEventData,
  TextInputSubmitEditingEventData,
} from 'react-native';

interface ADInputProps {
  value: string;
  setValue: (text: string) => void;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onTouchStart?: (event: GestureResponderEvent) => void;
  onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onEndEditing?: (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>,
  ) => void;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
}

const ADInput = (props: ADInputProps) => {
  const styles = useStyles;

  return (
    <Input
      style={styles.placeSearchInputContainer}
      inputStyle={styles.placeSearchInput}
      placeholder="Enter place"
      value={props.value}
      onChangeText={props.setValue}
      prefix={props.prefix}
      suffix={props.suffix}
      onTouchStart={props.onTouchStart}
      onChange={props.onChange}
      onEndEditing={props.onEndEditing}
      onSubmitEditing={props.onSubmitEditing}
    />
  );
};

const useStyles = StyleSheet.create({
  placeSearchInputContainer: {
    padding: 10,
    borderRadius: 100,
    borderWidth: 1,
    width: '95%',
    alignSelf: 'center',
  },
  placeSearchInput: {
    padding: 10,
  },
});

export default ADInput;
