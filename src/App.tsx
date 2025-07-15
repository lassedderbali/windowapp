import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {Colors} from './styles/colors';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import WindowCalculator from './components/WindowCalculator';
import MaterialsDatabase from './components/MaterialsDatabase';
import OptimizationTools from './components/OptimizationTools';

const App = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  const renderContent = () => {
    switch (activeTab) {
      case 'calculator':
        return <WindowCalculator />;
      case 'materials':
        return <MaterialsDatabase />;
      case 'optimization':
        return <OptimizationTools />;
      default:
        return <WindowCalculator />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.white} />
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default App;