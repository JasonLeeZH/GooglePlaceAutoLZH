import {Input, ListView, View} from '@ant-design/react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputEndEditingEventData,
  TouchableOpacity,
} from 'react-native';
import placeAutoCompleteMock from './mock/placeAutoComplete.json';
import placeDetailsMock from './mock/placeDetails.json';
import {
  GooglePlaceAutoRespItemParams,
  GooglePlaceAutoRespParams,
} from './interface/Common.interface';
import {useDispatch, useSelector} from 'react-redux';
import {addPlaces} from './store/slice';
import IconClick from './components/IconClick';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const App = () => {
  const {top} = useSafeAreaInsets();
  const styles = useStyles;

  const dispatch = useDispatch();
  const placesDataStored = useSelector((state: any) => state.places);

  const listRef = useRef<any>(null);
  const mapRef = useRef<MapView>(null);

  const [placeSearchInput, setPlaceSearchInput] = useState<string>('');
  const [touchedPlaceSearchInput, setTouchedPlaceSearchInput] =
    useState<boolean>(false);

  const [placeLatitude, setPlaceLatitude] = useState<number>(37.78825);
  const [placeLongitude, setPlaceLongitude] = useState<number>(-122.4324);
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

  const touchedSearchWithSaved: boolean =
    touchedPlaceSearchInput && placesData.length > 0;

  const callAPISearch = () => {
    const result = placeAutoCompleteMock as GooglePlaceAutoRespParams;

    if (result.status === 'OK') {
      setplacesData(result.predictions);
    }
  };

  const callAPISearchClick = () => {
    const result = placeDetailsMock;

    if (result.status === 'OK') {
      // Adding up by array length just to show diff place when clicked
      const latResult =
        result?.result?.geometry?.location?.lat + placesDataSaved?.length / 100;
      const lonResult =
        result?.result?.geometry?.location?.lng + placesDataSaved?.length / 100;

      setPlaceLatitude(latResult);
      setPlaceLongitude(lonResult);

      mapRef.current &&
        mapRef.current.animateCamera({
          center: {
            latitude: latResult,
            longitude: lonResult,
          },
        });
    }
  };

  const saveSearch = (extraValue?: string | undefined) => {
    dismissClear();

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

  const extraInputButtonPrefix = () => {
    return (
      <IconClick
        onPressAction={dismissClear}
        icon={require('./assets/back.png')}
      />
    );
  };

  const extraInputButtonSuffix = () => {
    return (
      <View style={styles.iconContainer}>
        {placeSearchInput.length > 0 && (
          <IconClick
            onPressAction={clearInput}
            icon={require('./assets/close.png')}
          />
        )}
        <IconClick
          onPressAction={() => placeSearchInput.length > 0 && saveSearch()}
          icon={require('./assets/search.png')}
        />
      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      <Input
        style={[styles.placeSearchInputContainer, {marginTop: top + 10}]}
        inputStyle={styles.placeSearchInput}
        placeholder="Enter place"
        value={placeSearchInput}
        prefix={
          touchedPlaceSearchInput &&
          placesData.length > 0 &&
          extraInputButtonPrefix()
        }
        suffix={touchedPlaceSearchInput && extraInputButtonSuffix()}
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
        onEndEditing={(
          val: NativeSyntheticEvent<TextInputEndEditingEventData>,
        ) => {
          val.nativeEvent.text.length > 0 &&
            setplacesDataSaved([...placesDataSaved, placeSearchInput]);
        }}
        onSubmitEditing={() => saveSearch()}
      />

      {touchedSearchWithSaved && (
        <View style={styles.outerContainer}>
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
              const getItemMainText =
                item?.structured_formatting?.main_text ?? item;
              const getItemDesc =
                item?.structured_formatting?.secondary_text ?? '';

              const mainText = [getItemMainText, getItemDesc].join(' ');
              const haveDesc = getItemDesc !== '';

              return (
                <TouchableOpacity
                  onPress={() => {
                    setPlaceSearchInput(mainText);
                    saveSearch(mainText);
                    callAPISearch();
                    callAPISearchClick();
                  }}>
                  <View style={styles.listItemStyle}>
                    <IconClick
                      onPressAction={clearInput}
                      icon={require('./assets/map.png')}
                    />
                    <View
                      style={[
                        styles.listItemTextContainer,
                        haveDesc && {
                          justifyContent: 'center',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.listItemTitle,
                          haveDesc && {
                            fontWeight: 'bold',
                          },
                        ]}>
                        {mainText}
                      </Text>
                      <Text style={styles.listItemDesc}>{getItemDesc}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            refreshable={false}
            keyboardShouldPersistTaps={'always'}
          />
        </View>
      )}

      <MapView
        ref={mapRef}
        style={!touchedSearchWithSaved && styles.outerContainer}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: placeLatitude,
          longitude: placeLongitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={{latitude: placeLatitude, longitude: placeLongitude}}
          title="Marker Title"
          description="Marker Description"
        />
      </MapView>
    </View>
  );
};

const useStyles = StyleSheet.create({
  outerContainer: {flex: 1},
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
  iconContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  listItemStyle: {
    height: 50,
    padding: 10,
    flexDirection: 'row',
  },
  listItemTextContainer: {
    marginLeft: 10,
  },
  listItemTitle: {
    fontSize: 16,
  },
  listItemDesc: {
    fontSize: 14,
  },
});

export default App;
