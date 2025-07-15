import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import { MaterialIcons } from '@expo/vector-icons';
import {Colors} from '../styles/colors';
import {Typography} from '../styles/typography';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import Picker from './Picker';
import {calculateWindowCost, type WindowSpecs, type CostBreakdown} from '../utils/calculations';

interface WindowProject {
  id: string;
  name: string;
  specs: WindowSpecs;
  breakdown?: CostBreakdown;
}

const WindowCalculator = () => {
  const [windows, setWindows] = useState<WindowProject[]>([
    {
      id: '1',
      name: 'نافذة 1',
      specs: {
        length: 100,
        width: 100,
        color: 'blanc',
        frameType: 'eurosist',
        sashType: '6007',
        sashSubType: 'inoforme',
        glassType: 'simple',
      },
    },
  ]);

  const [activeWindowId, setActiveWindowId] = useState('1');
  const [isCalculating, setIsCalculating] = useState(false);
  const [profitMargin, setProfitMargin] = useState(30);

  const colorOptions = [
    {value: 'blanc', label: 'أبيض'},
    {value: 'fbois', label: 'خشبي'},
    {value: 'gris', label: 'رمادي'},
  ];

  const getFrameOptions = (color: string) => {
    const allFrameOptions = [
      {value: 'eurosist', label: 'Eurosist', colors: ['blanc', 'fbois']},
      {value: 'inoforme', label: 'Inoforme', colors: ['blanc']},
      {value: 'eco_loranzo', label: 'Eco Loranzo', colors: ['blanc']},
      {value: 'pral', label: 'Pral', colors: ['fbois']},
      {value: 'inter', label: 'Inter', colors: ['fbois']},
      {value: 'losanzo', label: 'Losanzo', colors: ['gris']},
    ];

    return allFrameOptions.filter(option => option.colors.includes(color));
  };

  const getSashOptions = (color: string) => {
    const allSashOptions = [
      {
        value: '6007',
        label: '6007',
        types: [
          {value: 'inoforme', label: 'Inoforme', colors: ['blanc']},
          {value: 'gris', label: 'Gris', colors: ['gris']},
        ],
      },
      {
        value: '40404',
        label: '40404',
        types: [
          {value: 'eurosist', label: 'Eurosist', colors: ['blanc']},
          {value: 'inter', label: 'Inter', colors: ['blanc']},
          {value: 'pral', label: 'Pral', colors: ['fbois']},
          {value: 'technoline', label: 'Technoline', colors: ['fbois']},
          {value: 'eurosist', label: 'Eurosist', colors: ['fbois']},
        ],
      },
    ];

    return allSashOptions
      .map(sashOption => ({
        ...sashOption,
        types: sashOption.types.filter(type => type.colors.includes(color)),
      }))
      .filter(sashOption => sashOption.types.length > 0);
  };

  const activeWindow = windows.find(w => w.id === activeWindowId);

  const addWindow = () => {
    const newId = Date.now().toString();
    const newWindow: WindowProject = {
      id: newId,
      name: `نافذة ${windows.length + 1}`,
      specs: {
        length: 100,
        width: 100,
        color: 'blanc',
        frameType: 'eurosist',
        sashType: '6007',
        sashSubType: 'inoforme',
        glassType: 'simple',
      },
    };
    setWindows([...windows, newWindow]);
    setActiveWindowId(newId);
  };

  const removeWindow = (id: string) => {
    if (windows.length === 1) return;
    const newWindows = windows.filter(w => w.id !== id);
    setWindows(newWindows);
    if (activeWindowId === id) {
      setActiveWindowId(newWindows[0].id);
    }
  };

  const updateWindowSpecs = (specs: Partial<WindowSpecs>) => {
    setWindows(
      windows.map(w =>
        w.id === activeWindowId ? {...w, specs: {...w.specs, ...specs}} : w,
      ),
    );
  };

  const updateWindowName = (id: string, name: string) => {
    setWindows(windows.map(w => (w.id === id ? {...w, name} : w)));
  };

  const calculateSingleWindow = async () => {
    if (!activeWindow) return;

    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const breakdown = calculateWindowCost(activeWindow.specs, profitMargin / 100);
    setWindows(
      windows.map(w => (w.id === activeWindowId ? {...w, breakdown} : w)),
    );
    setIsCalculating(false);
  };

  const handleColorChange = (newColor: string) => {
    const frameOptions = getFrameOptions(newColor);
    const sashOptions = getSashOptions(newColor);

    const firstFrameOption = frameOptions[0];
    const firstSashOption = sashOptions[0];
    const firstSashSubType = firstSashOption?.types[0];

    updateWindowSpecs({
      color: newColor,
      frameType: firstFrameOption?.value || 'eurosist',
      sashType: firstSashOption?.value || '6007',
      sashSubType: firstSashSubType?.value || 'inoforme',
    });
  };

  const handleSashTypeChange = (newSashType: string) => {
    if (!activeWindow) return;
    const sashOptions = getSashOptions(activeWindow.specs.color);
    const sashOption = sashOptions.find(opt => opt.value === newSashType);
    const firstType = sashOption?.types[0];

    updateWindowSpecs({
      sashType: newSashType,
      sashSubType: firstType?.value || 'inoforme',
    });
  };

  const saveProject = async () => {
    try {
      const projectData = {
        windows,
        profitMargin,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem('windowProject', JSON.stringify(projectData));
      Alert.alert('تم الحفظ', 'تم حفظ المشروع بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'فشل في حفظ المشروع');
    }
  };

  const shareResults = async () => {
    if (!activeWindow?.breakdown) return;

    const shareText = `
نتائج حساب النافذة: ${activeWindow.name}
الأبعاد: ${activeWindow.specs.length}×${activeWindow.specs.width} سم
التكلفة الإجمالية: ${activeWindow.breakdown.totalCost.toFixed(2)} د.ت
نسبة الربح: ${profitMargin}%

تم إنشاؤه بواسطة تطبيق حاسبة النوافذ
    `;

    try {
      if (await Sharing.isAvailableAsync()) {
        // Create a temporary file with the results
        const fileName = `window-calculation-${Date.now()}.txt`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, shareText);
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('خطأ', 'المشاركة غير متاحة على هذا الجهاز');
      }
    } catch (error) {
      console.log('Error sharing:', error);
      Alert.alert('خطأ', 'فشل في مشاركة النتائج');
    }
  };

  const totalCost = windows.reduce((sum, w) => sum + (w.breakdown?.totalCost || 0), 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Card>
        <Text style={styles.title}>حاسبة تكلفة النوافذ</Text>
        <Text style={styles.subtitle}>
          احسب التكلفة الدقيقة لتصنيع النوافذ مع تحسين استخدام المواد
        </Text>
      </Card>

      {/* Project Summary */}
      {windows.length > 1 && (
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryTitle}>مشروع النوافذ</Text>
              <Text style={styles.summarySubtitle}>
                {windows.length} نافذة - ربح {profitMargin}%
              </Text>
            </View>
            <View style={styles.summaryTotal}>
              <Text style={styles.totalCost}>{totalCost.toFixed(2)} د.ت</Text>
              <Text style={styles.totalLabel}>التكلفة الإجمالية</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Windows List */}
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>قائمة النوافذ</Text>
          <Button
            title="إضافة"
            onPress={addWindow}
            size="small"
            icon="add"
          />
        </View>

        {windows.map(window => (
          <View
            key={window.id}
            style={[
              styles.windowItem,
              activeWindowId === window.id && styles.activeWindowItem,
            ]}>
            <View style={styles.windowInfo}>
              <Text style={styles.windowName}>{window.name}</Text>
              <Text style={styles.windowSpecs}>
                {window.specs.length}×{window.specs.width} سم
              </Text>
              {window.breakdown && (
                <Text style={styles.windowCost}>
                  {window.breakdown.totalCost.toFixed(2)} د.ت
                </Text>
              )}
            </View>
            <View style={styles.windowActions}>
              <Button
                title="تحديد"
                onPress={() => setActiveWindowId(window.id)}
                size="small"
                variant={activeWindowId === window.id ? 'primary' : 'outline'}
              />
              {windows.length > 1 && (
                <Button
                  title="حذف"
                  onPress={() => removeWindow(window.id)}
                  size="small"
                  variant="outline"
                  style={styles.deleteButton}
                />
              )}
            </View>
          </View>
        ))}
      </Card>

      {/* Input Form */}
      {activeWindow && (
        <Card>
          <Text style={styles.sectionTitle}>{activeWindow.name}</Text>

          <View style={styles.dimensionsRow}>
            <Input
              label="الطول (سم)"
              value={activeWindow.specs.length.toString()}
              onChangeText={text =>
                updateWindowSpecs({length: parseInt(text) || 0})
              }
              keyboardType="numeric"
              containerStyle={styles.dimensionInput}
            />
            <Input
              label="العرض (سم)"
              value={activeWindow.specs.width.toString()}
              onChangeText={text =>
                updateWindowSpecs({width: parseInt(text) || 0})
              }
              keyboardType="numeric"
              containerStyle={styles.dimensionInput}
            />
          </View>

          <Picker
            label="اللون"
            value={activeWindow.specs.color}
            options={colorOptions}
            onValueChange={handleColorChange}
          />

          <Picker
            label="نوع القفص"
            value={activeWindow.specs.frameType}
            options={getFrameOptions(activeWindow.specs.color).map(option => ({
              value: option.value,
              label: `40100 ${option.label}`,
            }))}
            onValueChange={value => updateWindowSpecs({frameType: value})}
          />

          <Picker
            label="نوع الفردة الرئيسي"
            value={activeWindow.specs.sashType}
            options={getSashOptions(activeWindow.specs.color).map(option => ({
              value: option.value,
              label: option.label,
            }))}
            onValueChange={handleSashTypeChange}
          />

          <Picker
            label="نوع الفردة التفصيلي"
            value={activeWindow.specs.sashSubType}
            options={
              getSashOptions(activeWindow.specs.color)
                .find(opt => opt.value === activeWindow.specs.sashType)
                ?.types.map(type => ({
                  value: type.value,
                  label: `${activeWindow.specs.sashType} ${type.label}`,
                })) || []
            }
            onValueChange={value => updateWindowSpecs({sashSubType: value})}
          />

          <Picker
            label="نوع الزجاج"
            value={activeWindow.specs.glassType}
            options={[
              {value: 'simple', label: 'زجاج عادي 4مم'},
              {value: 'double', label: 'زجاج مزدوج'},
              {value: 'tempered', label: 'زجاج مقوى'},
            ]}
            onValueChange={value => updateWindowSpecs({glassType: value})}
          />

          <Input
            label="نسبة الربح (%)"
            value={profitMargin.toString()}
            onChangeText={text => setProfitMargin(parseInt(text) || 0)}
            keyboardType="numeric"
          />

          <Button
            title="احسب التكلفة"
            onPress={calculateSingleWindow}
            loading={isCalculating}
            icon="calculate"
            style={styles.calculateButton}
          />
        </Card>
      )}

      {/* Results */}
      {activeWindow?.breakdown && (
        <Card>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>نتائج الحساب</Text>
            <Text style={styles.resultCost}>
              {activeWindow.breakdown.totalCost.toFixed(2)} د.ت
            </Text>
          </View>

          <View style={styles.resultDetails}>
            <Text style={styles.resultSpecs}>
              الأبعاد: {activeWindow.specs.length}×{activeWindow.specs.width} سم
            </Text>
            <Text style={styles.resultSpecs}>
              المساحة: {((activeWindow.specs.length * activeWindow.specs.width) / 10000).toFixed(2)} م²
            </Text>
            <Text style={styles.resultSpecs}>
              التكلفة للمتر: {(activeWindow.breakdown.totalCost / ((activeWindow.specs.length * activeWindow.specs.width) / 10000)).toFixed(2)} د.ت
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="حفظ المشروع"
              onPress={saveProject}
              variant="secondary"
              icon="save"
              style={styles.actionButton}
            />
            <Button
              title="مشاركة النتائج"
              onPress={shareResults}
              variant="outline"
              icon="share"
              style={styles.actionButton}
            />
          </View>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.bodySecondary,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.success,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    ...Typography.h3,
    color: Colors.white,
  },
  summarySubtitle: {
    ...Typography.small,
    color: Colors.white,
    opacity: 0.8,
  },
  summaryTotal: {
    alignItems: 'flex-end',
  },
  totalCost: {
    ...Typography.h2,
    color: Colors.white,
  },
  totalLabel: {
    ...Typography.small,
    color: Colors.white,
    opacity: 0.8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.h3,
  },
  windowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginVertical: 4,
  },
  activeWindowItem: {
    borderColor: Colors.primary,
    backgroundColor: Colors.gray50,
  },
  windowInfo: {
    flex: 1,
  },
  windowName: {
    ...Typography.body,
    fontWeight: '600',
  },
  windowSpecs: {
    ...Typography.small,
  },
  windowCost: {
    ...Typography.price,
    fontSize: 14,
  },
  windowActions: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteButton: {
    borderColor: Colors.error,
  },
  dimensionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  dimensionInput: {
    flex: 1,
  },
  calculateButton: {
    marginTop: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    ...Typography.h3,
  },
  resultCost: {
    ...Typography.h2,
    color: Colors.success,
  },
  resultDetails: {
    marginBottom: 16,
  },
  resultSpecs: {
    ...Typography.small,
    marginVertical: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});

export default WindowCalculator;