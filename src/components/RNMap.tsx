import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface RNMapViewProps {
  ref: any;
  regionData: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  extraStyle?: any;
}

const RNMapView = (props: RNMapViewProps) => {
  const styles = useStyles;

  return (
    <MapView
      ref={props.ref}
      style={[styles.outerContainer, props.extraStyle]}
      provider={PROVIDER_GOOGLE}
      initialRegion={props.regionData}>
      <Marker
        coordinate={{
          latitude: props.regionData.latitude,
          longitude: props.regionData.longitude,
        }}
        title="Marker Title"
        description="Marker Description"
      />
    </MapView>
  );
};

const useStyles = StyleSheet.create({
  outerContainer: { flex: 1 },
});

export default RNMapView;
