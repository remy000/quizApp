import { StyleSheet, Text, View,Dimensions } from 'react-native'
import MapView,{Marker} from 'react-native-maps'
import * as Loc from 'expo-location'
import React, { useEffect, useState } from 'react'

const Location = () => {
    const [location,setLocation]=useState(null);
    useEffect(()=>{
        (async()=>{
            let {status}=await Loc.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }
            let currentLocation= await Loc.getCurrentPositionAsync({});
            setLocation(currentLocation);
              
        })();
    },[]);
    return (
        <View style={styles.container}>
          {location && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title='Your Location'
              />
            </MapView>
          )}
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
    });
    

export default Location;