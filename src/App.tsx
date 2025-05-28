import {Input, ListView, View} from '@ant-design/react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, Text, TouchableWithoutFeedback} from 'react-native';
import placesmock from './mock/places.json';

const App = () => {
  const [placeSearchInput, setPlaceSearchInput] = useState<string>('');
  const [touuchedPlaceSearchInput, setTouuchedPlaceSearchInput] =
    useState<boolean>(false);
  const listRef = useRef<any>(null);

  const [placesDataSaved, setplacesDataSaved] = useState<string[]>([]);
  const [placesData, setplacesData] = useState<any>([
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
  ]);

  const callAPISearch = () => {
    console.log('api called');
    const result = placesmock;

    if (result.status === 'OK') {
      setplacesData(result.predictions);
    }
  };

  useEffect(() => {
    console.log('wewe', placesData, listRef);
    listRef?.current?.refresh();
  }, [placesData]);

  useEffect(() => {
    console.log('touchshow', touuchedPlaceSearchInput);
  }, [touuchedPlaceSearchInput]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setTouuchedPlaceSearchInput(false);
      }}>
      <View style={{flex: 1}}>
        <Input
          allowClear
          style={{marginTop: '20%', padding: 20, backgroundColor: 'grey'}}
          placeholder="Enter place"
          value={placeSearchInput}
          onTouchStart={() => {
            console.log('touch start');
            setTouuchedPlaceSearchInput(true);
          }}
          onTouchCancel={() => {
            console.log('touch cancel');
            setTouuchedPlaceSearchInput(false);
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

        {touuchedPlaceSearchInput && (
          <View style={{maxHeight: '50%'}}>
            <ListView
              ref={listRef}
              onFetch={(
                page = 1,
                startFetch: (arg0: string[], arg1: number) => void,
                abortFetch: () => void,
              ) => {
                console.log(
                  'on fetch',
                  page,
                  placesData.length,
                  listRef?.current?.props?.renderItem?.length,
                );
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
              renderItem={(item: any) => {
                return (
                  <View style={{backgroundColor: 'red'}}>
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

export default App;
