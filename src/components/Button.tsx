import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {Colors} from '../styles/colors';
import {Typography} from '../styles/typography';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
}

const Button: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = styles.button;
    const sizeStyle = styles[`${size}Button` as keyof typeof styles];
    const variantStyle = styles[`${variant}Button` as keyof typeof styles];
    
    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = styles.buttonText;
    const sizeStyle = styles[`${size}ButtonText` as keyof typeof styles];
    const variantStyle = styles[`${variant}ButtonText` as keyof typeof styles];
    
    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? Colors.primary : Colors.white}
          size="small"
        />
      ) : (
        <>
          {icon && (
            <MaterialIcons
              name={icon}
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
              color={variant === 'outline' ? Colors.primary : Colors.white}
              style={styles.icon}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  
  // Size styles
  smallButton: {
    paddingVertical: 8,
  },
  mediumButton: {
    paddingVertical: 12,
  },
  largeButton: {
    paddingVertical: 16,
  },
  
  // Variant styles
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  
  // Text styles
  buttonText: {
    ...Typography.body,
    fontWeight: '600',
    textAlign: 'center',
  },
  smallButtonText: {
    fontSize: 14,
  },
  mediumButtonText: {
    fontSize: 16,
  },
  largeButtonText: {
    fontSize: 18,
  },
  primaryButtonText: {
    color: Colors.white,
  },
  secondaryButtonText: {
    color: Colors.white,
  },
  outlineButtonText: {
    color: Colors.primary,
  },
  
  icon: {
    marginRight: 8,
  },
});

export default Button;