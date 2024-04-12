import { StyleSheet, Text, View, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'

const NotificationScreen = ({ message, onClose,duration }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
  
      const timeout = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          onClose();
        });
      }, duration);
  
      return () => clearTimeout(timeout);
    }, []);
  
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
    <Text style={styles.message}>{message}</Text>
  </Animated.View>
  )
}

export default NotificationScreen;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 7,
        left: 20,
        right: 20,
        backgroundColor: 'rgb(0, 0, 61)',
        paddingTop: 20,
        paddingHorizontal:20,
        borderRadius: 8,
        zIndex: 999,
      },
      message: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight:'bold',
      },
})