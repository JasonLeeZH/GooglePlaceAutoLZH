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
import {useDispatch, useSelector} from 'react-redux';
import {addPlaces} from './store/slice';
import IconClick from './components/IconClick';

const App = () => {
  const styles = useStyles;

  const dispatch = useDispatch();
  const placesDataStored = useSelector((state: any) => state.places);

  const listRef = useRef<any>(null);

  const [placeSearchInput, setPlaceSearchInput] = useState<string>('');
  const [touchedPlaceSearchInput, setTouchedPlaceSearchInput] =
    useState<boolean>(false);

  const [placesDataSaved, setplacesDataSaved] = useState<string[]>([]);
  const [placesData, setplacesData] =
    useState<GooglePlaceAutoRespItemParams[]>(placesDataStored);

  useEffect(() => {
    listRef?.current?.refresh();
  }, [placesData]);

  const dismissClear = () => {
    Keyboard.dismiss();
    setTouchedPlaceSearchInput(false);
  };

  const callAPISearch = () => {
    const result = placesmock as GooglePlaceAutoRespParams;

    if (result.status === 'OK') {
      setplacesData(result.predictions);
    }
  };

  const saveSearch = (extraValue?: string | undefined) => {
    Keyboard.dismiss();

    const valueToAdd =
      extraValue && extraValue !== '' ? extraValue : placeSearchInput;
    if (!placesDataSaved.includes(valueToAdd)) {
      dispatch(addPlaces(valueToAdd));
    }
  };

  const clearInput = () => {
    setPlaceSearchInput('');
    setplacesData(placesDataStored);
  };

  const extraInputButton = () => {
    return (
      <View style={styles.iconContainer}>
        {placeSearchInput.length > 0 && (
          <IconClick
            onPressAction={clearInput}
            icon={require('./assets/close.png')}
          />
        )}
        <IconClick
          onPressAction={() => saveSearch()}
          icon={require('./assets/search.png')}
        />
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={dismissClear}>
      <View style={styles.outerContainer}>
        <Input
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
          suffix={touchedPlaceSearchInput && extraInputButton()}
          onSubmitEditing={() => saveSearch()}
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
                const getItemDetail = item?.description ?? item;

                return (
                  <View style={styles.listItemStyle}>
                    <Text
                      onPress={() => {
                        setPlaceSearchInput(getItemDetail);
                        setTouchedPlaceSearchInput(false);
                        saveSearch(getItemDetail);
                      }}>
                      {getItemDetail}
                    </Text>
                  </View>
                );
              }}
              refreshable={false}
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
  iconContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  icon: {width: 20, height: 20},
  listItemContainer: {maxHeight: '50%'},
  listItemStyle: {backgroundColor: 'red'},
});

export default App;
