import { ListView, View } from '@ant-design/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GooglePlaceAutoRespItemParams } from '../interface/Common.interface';

interface ADListViewProps {
  ref: any;
  data: any;
  renderItem: any;
}

const ADListView = (props: ADListViewProps) => {
  const styles = useStyles;

  return (
    <View style={styles.outerContainer}>
      <ListView
        ref={props.ref}
        onFetch={(
          page = 1,
          startFetch: (
            arg0: GooglePlaceAutoRespItemParams[],
            arg1: number,
          ) => void,
          abortFetch: () => void,
        ) => {
          try {
            if (
              page === props.ref?.current?.props?.renderItem?.length ||
              props.ref?.current?.props?.renderItem?.length === undefined
            ) {
              startFetch(props.data, 1);
            } else {
              startFetch([], 1);
            }
          } catch (err) {
            abortFetch();
          }
        }}
        renderItem={props.renderItem}
        refreshable={false}
        keyboardShouldPersistTaps={'always'}
      />
    </View>
  );
};

const useStyles = StyleSheet.create({
  outerContainer: { flex: 1 },
});

export default ADListView;
