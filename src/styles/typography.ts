import {StyleSheet} from 'react-native';
import {Colors} from './colors';

export const Typography = StyleSheet.create({
  // Headers
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  
  // Body text
  body: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  bodySecondary: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  
  // Small text
  small: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  caption: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'right',
  },
  
  // Special text
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.success,
    textAlign: 'right',
  },
  error: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'right',
  },
});