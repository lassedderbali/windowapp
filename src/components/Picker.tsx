import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {Picker as RNPicker} from '@react-native-picker/picker';
import {Colors} from '../styles/colors';
import {Typography} from '../styles/typography';

interface Option {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  value: string;
  options: Option[];
  onValueChange: (value: string) => void;
  containerStyle?: ViewStyle;
}

const Picker: React.FC<Props> = ({
  label,
  value,
  options,
  onValueChange,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.pickerContainer}>
        <RNPicker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          mode="dropdown">
          {options.map(option => (
            <RNPicker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </RNPicker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    ...Typography.small,
    fontWeight: '600',
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  picker: {
    height: 50,
  },
});

export default Picker;