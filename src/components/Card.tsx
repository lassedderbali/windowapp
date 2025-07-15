import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Colors} from '../styles/colors';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Card: React.FC<Props> = ({children, style}) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default Card;