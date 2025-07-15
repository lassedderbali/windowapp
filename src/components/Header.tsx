import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../styles/colors';
import {Typography} from '../styles/typography';

const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Icon name="business" size={32} color={Colors.primary} />
          <Text style={styles.title}>نظام حساب تكلفة النوافذ</Text>
        </View>
        <View style={styles.badge}>
          <Icon name="attach-money" size={16} color={Colors.success} />
          <Text style={styles.badgeText}>دقة في الحسابات</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomWidth: 4,
    borderBottomColor: Colors.primary,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...Typography.h2,
    marginLeft: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    ...Typography.small,
    marginLeft: 4,
  },
});

export default Header;