import {Input, ListView, View} from '@ant-design/react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import placesmock from './mock/places.json';
import {
  GooglePlaceAutoRespItemParams,
  GooglePlaceAutoRespParams,
} from './interface/Common.interface';

const App = () => {
  const styles = useStyles;

  const [placeSearchInput, setPlaceSearchInput] = useState<string>('');
  const [touchedPlaceSearchInput, setTouchedPlaceSearchInput] =
    useState<boolean>(false);
  const listRef = useRef<any>(null);

  const [placesDataSaved, setplacesDataSaved] = useState<string[]>([]);
  const [placesData, setplacesData] = useState<GooglePlaceAutoRespItemParams[]>(
    [
      {
        description: 'Paris, France',
        matched_substrings: [{length: 5, offset: 0}],
        place_id: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
        reference: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
        structured_formatting: {
          main_text: 'Paris',
          main_text_matched_substrings: [{length: 5, offset: 0}],
          secondary_text: 'France',
        },
        terms: [
          {offset: 0, value: 'Paris'},
          {offset: 7, value: 'France'},
        ],
        types: ['locality', 'political', 'geocode'],
      },
    ],
  );

  const callAPISearch = () => {
    console.log('api called');
    const result = placesmock as GooglePlaceAutoRespParams;

    if (result.status === 'OK') {
      setplacesData(result.predictions);
    }
  };

  useEffect(() => {
    console.log('wewe', placesData, listRef);
    listRef?.current?.refresh();
  }, [placesData]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setTouchedPlaceSearchInput(false);
      }}>
      <View style={styles.outerContainer}>
        <Input
          allowClear
          style={styles.placeSearchInput}
          placeholder="Enter place"
          value={placeSearchInput}
          onTouchStart={() => {
            setTouchedPlaceSearchInput(true);
          }}
          onChange={val => {
            setTouchedPlaceSearchInput(val?.nativeEvent?.text !== '');
          }}
          onChangeText={v => {
            setPlaceSearchInput(v);
            /^[a-zA-Z0-9_]*$/.test(placeSearchInput) &&
              v.length > 0 &&
              callAPISearch();
          }}
          onEndEditing={() => {
            setplacesDataSaved([...placesDataSaved, placeSearchInput]);
          }}
        />

        {touchedPlaceSearchInput && (
          <View style={styles.listItemContainer}>
            <ListView
              ref={listRef}
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
                    page === listRef?.current?.props?.renderItem?.length ||
                    listRef?.current?.props?.renderItem?.length === undefined
                  ) {
                    startFetch(placesData, 1);
                  } else {
                    startFetch([], 1);
                  }
                } catch (err) {
                  abortFetch();
                }
              }}
              renderItem={(item: GooglePlaceAutoRespItemParams) => {
                return (
                  <View style={styles.listItemStyle}>
                    <Text onPress={() => {}}>{item?.description}</Text>
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const useStyles = StyleSheet.create({
  outerContainer: {flex: 1},
  placeSearchInput: {marginTop: '20%', padding: 20, backgroundColor: 'grey'},
  listItemContainer: {maxHeight: '50%'},
  listItemStyle: {backgroundColor: 'red'},
});

export default App;
