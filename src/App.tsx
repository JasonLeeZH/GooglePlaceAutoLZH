import {Input, ListView, View} from '@ant-design/react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
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
  const mapRef = useRef<any>(null);

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

  const callAPISearch = () => {
    const result = placeAutoCompleteMock as GooglePlaceAutoRespParams;

    if (result.status === 'OK') {
      setplacesData(result.predictions);
    }
  };

  const callAPISearchClick = () => {
    const result = placeDetailsMock;

    if (result.status === 'OK') {
      const latResult =
        result.result.geometry.location.lat + placesDataSaved.length / 100;
      const lonResult =
        result.result.geometry.location.lng + placesDataSaved.length / 100;
      setPlaceLatitude(latResult);
      setPlaceLongitude(lonResult);
      mapRef.current.animateToRegion(
        {
          latitude: latResult,
          longitude: lonResult,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        500,
      );
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
          style={[styles.placeSearchInputContainer, {marginTop: top + 10}]}
          inputStyle={styles.placeSearchInput}
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

        {touchedPlaceSearchInput && placesData.length > 0 && (
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
                        callAPISearchClick();
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

        <MapView
          ref={mapRef}
          style={styles.outerContainer}
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
    </TouchableWithoutFeedback>
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
  icon: {width: 20, height: 20},
  listItemContainer: {maxHeight: '50%'},
  listItemStyle: {backgroundColor: 'red'},
});

export default App;
