import { View } from '@ant-design/react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputChangeEventData,
  TouchableOpacity,
} from 'react-native';
import { GooglePlaceAutoRespItemParams } from './interface/Common.interface';
import { useDispatch, useSelector } from 'react-redux';
import IconClick from './components/IconClick';
import MapView from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ADInput from './components/ADInput';
import {
  setPlaceAutoComplete,
  setPlaceDetails,
  setPlaceSaved,
} from './store/slice';
import ADListView from './components/ADListView';
import RNMapView from './components/RNMap';

const App = () => {
  const { top } = useSafeAreaInsets();
  const styles = useStyles;

  const dispatch = useDispatch();
  const placeAutoComplete = useSelector(
    (state: any) => state.placeAutoComplete,
  );
  const placesSaved = useSelector((state: any) => state.placesSaved);
  const placeDetails = useSelector((state: any) => state.placeDetails);

  const listRef = useRef<any>(null);
  const mapRef = useRef<MapView>(null);

  const [placeSearchInput, setPlaceSearchInput] = useState<string>('');
  const [touchedPlaceSearchInput, setTouchedPlaceSearchInput] =
    useState<boolean>(false);

  const [placeLatitude, setPlaceLatitude] = useState<number>(37.78825);
  const [placeLongitude, setPlaceLongitude] = useState<number>(-122.4324);
  const [placesData, setplacesData] =
    useState<GooglePlaceAutoRespItemParams[]>(placesSaved);

  useEffect(() => {
    listRef?.current?.refresh();
  }, [placesData]);

  useEffect(() => {
    if (placeDetails !== null) {
      const latResult = placeDetails?.geometry?.location?.lat;
      const lonResult = placeDetails?.geometry?.location?.lng;

      setPlaceLatitude(latResult);
      setPlaceLongitude(lonResult);

      mapRef.current &&
        mapRef.current.animateCamera({
          center: {
            latitude: latResult,
            longitude: lonResult,
          },
        });

      dispatch(setPlaceDetails(null));
    } else if (placeAutoComplete.length !== 0) {
      setplacesData(placeAutoComplete);
      dispatch(setPlaceAutoComplete([]));
    }
  }, [dispatch, placeDetails, placeAutoComplete]);

  const touchedSearchWithSaved: boolean =
    touchedPlaceSearchInput && placesData?.length > 0;

  const dismissClear = () => {
    Keyboard.dismiss();
    setTouchedPlaceSearchInput(false);
  };

  const clearInput = () => {
    setPlaceSearchInput('');
    setplacesData(placesSaved);
  };

  const saveSearch = (extraValue?: Partial<GooglePlaceAutoRespItemParams>) => {
    dismissClear();

    const valueToAdd = extraValue ?? placeSearchInput;

    if (!placesSaved.includes(valueToAdd)) {
      dispatch(setPlaceSaved(valueToAdd));
      dispatch({
        type: 'handlePlaceDetails',
        payload: valueToAdd,
      });
    }
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
    <View style={[styles.outerContainer, { marginTop: top + 10 }]}>
      <ADInput
        value={placeSearchInput}
        setValue={(v: string) => {
          setPlaceSearchInput(v);
          /^[a-zA-Z0-9_]*$/.test(placeSearchInput) &&
            v.length > 0 &&
            dispatch({
              type: 'handlePlaceAutoComplete',
              payload: placeSearchInput,
            });
        }}
        prefix={
          touchedPlaceSearchInput &&
          placesData?.length > 0 &&
          extraInputButtonPrefix()
        }
        suffix={touchedPlaceSearchInput && extraInputButtonSuffix()}
        onTouchStart={() => {
          setTouchedPlaceSearchInput(true);
        }}
        onChange={(val: NativeSyntheticEvent<TextInputChangeEventData>) => {
          setTouchedPlaceSearchInput(val?.nativeEvent?.text !== '');
        }}
        onSubmitEditing={() => saveSearch()}
      />

      {touchedSearchWithSaved && (
        <ADListView
          ref={listRef}
          data={placesData}
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
                  saveSearch({
                    structured_formatting: {
                      main_text: mainText,
                      secondary_text: getItemDesc,
                      main_text_matched_substrings:
                        item?.structured_formatting
                          ?.main_text_matched_substrings ?? [],
                    },
                  });
                }}>
                <View style={styles.listItemStyle}>
                  <IconClick icon={require('./assets/map.png')} />
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
        />
      )}

      <RNMapView
        ref={mapRef}
        regionData={{
          latitude: placeLatitude,
          longitude: placeLongitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        extraStyle={touchedSearchWithSaved && { flex: 'unset' }}
      />
    </View>
  );
};

const useStyles = StyleSheet.create({
  outerContainer: { flex: 1 },
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
