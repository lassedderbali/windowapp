import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../styles/colors';
import {Typography} from '../styles/typography';
import Card from './Card';
import Button from './Button';
import Input from './Input';

interface WindowSpec {
  id: string;
  length: number;
  width: number;
  quantity: number;
}

const OptimizationTools = () => {
  const [windows, setWindows] = useState<WindowSpec[]>([
    {id: '1', length: 100, width: 100, quantity: 1},
    {id: '2', length: 120, width: 110, quantity: 1},
  ]);

  const [optimization, setOptimization] = useState<any>(null);

  const addWindow = () => {
    const newId = Date.now().toString();
    setWindows([...windows, {id: newId, length: 100, width: 100, quantity: 1}]);
  };

  const removeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const updateWindow = (id: string, field: keyof WindowSpec, value: number) => {
    setWindows(windows.map(w => (w.id === id ? {...w, [field]: value} : w)));
  };

  const calculateOptimization = () => {
    const barLength = 650; // cm
    let totalFrameLength = 0;
    let totalSashLength = 0;

    windows.forEach(window => {
      const framePerimeter = 2 * (window.length + window.width);
      const sashLength = window.length - 4;
      const sashWidth = (window.width - 4.7) / 2;
      const sashPerimeter = 2 * (sashLength + sashWidth) * 2; // Two sashes

      totalFrameLength += framePerimeter * window.quantity;
      totalSashLength += sashPerimeter * window.quantity;
    });

    const frameBarsNeeded = Math.ceil(totalFrameLength / barLength);
    const sashBarsNeeded = Math.ceil(totalSashLength / barLength);

    const frameWaste = frameBarsNeeded * barLength - totalFrameLength;
    const sashWaste = sashBarsNeeded * barLength - totalSashLength;

    const result = {
      frame: {
        totalLength: totalFrameLength,
        barsNeeded: frameBarsNeeded,
        waste: frameWaste,
        efficiency: (totalFrameLength / (frameBarsNeeded * barLength)) * 100,
      },
      sash: {
        totalLength: totalSashLength,
        barsNeeded: sashBarsNeeded,
        waste: sashWaste,
        efficiency: (totalSashLength / (sashBarsNeeded * barLength)) * 100,
      },
    };

    setOptimization(result);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Card>
        <Text style={styles.title}>أدوات تحسين القص</Text>
        <Text style={styles.subtitle}>
          احسب الكمية المثلى للمواد وقلل الهدر عند تصنيع عدة نوافذ
        </Text>
      </Card>

      {/* Input Section */}
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>قائمة النوافذ</Text>
          <Button title="إضافة نافذة" onPress={addWindow} size="small" icon="add" />
        </View>

        {windows.map((window, index) => (
          <View key={window.id} style={styles.windowItem}>
            <View style={styles.windowHeader}>
              <Text style={styles.windowTitle}>نافذة {index + 1}</Text>
              {windows.length > 1 && (
                <Button
                  title="حذف"
                  onPress={() => removeWindow(window.id)}
                  size="small"
                  variant="outline"
                />
              )}
            </View>

            <View style={styles.inputRow}>
              <Input
                label="الطول (سم)"
                value={window.length.toString()}
                onChangeText={text =>
                  updateWindow(window.id, 'length', Number(text))
                }
                keyboardType="numeric"
                containerStyle={styles.inputItem}
              />
              <Input
                label="العرض (سم)"
                value={window.width.toString()}
                onChangeText={text =>
                  updateWindow(window.id, 'width', Number(text))
                }
                keyboardType="numeric"
                containerStyle={styles.inputItem}
              />
              <Input
                label="الكمية"
                value={window.quantity.toString()}
                onChangeText={text =>
                  updateWindow(window.id, 'quantity', Number(text))
                }
                keyboardType="numeric"
                containerStyle={styles.inputItem}
              />
            </View>
          </View>
        ))}

        <Button
          title="احسب التحسين"
          onPress={calculateOptimization}
          icon="calculate"
          style={styles.calculateButton}
        />
      </Card>

      {/* Results Section */}
      {optimization ? (
        <>
          {/* Frame Results */}
          <Card>
            <View style={styles.resultHeader}>
              <Icon name="build" size={24} color={Colors.primary} />
              <Text style={styles.resultTitle}>نتائج القوافص (40100)</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{optimization.frame.barsNeeded}</Text>
                <Text style={styles.statLabel}>عدد البارات</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, {color: Colors.success}]}>
                  {optimization.frame.efficiency.toFixed(1)}%
                </Text>
                <Text style={styles.statLabel}>الكفاءة</Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>الطول المطلوب:</Text>
                <Text style={styles.detailValue}>
                  {optimization.frame.totalLength} سم
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>الطول المتوفر:</Text>
                <Text style={styles.detailValue}>
                  {optimization.frame.barsNeeded * 650} سم
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>الهدر:</Text>
                <Text style={[styles.detailValue, {color: Colors.error}]}>
                  {optimization.frame.waste} سم
                </Text>
              </View>
            </View>
          </Card>

          {/* Sash Results */}
          <Card>
            <View style={styles.resultHeader}>
              <Icon name="build" size={24} color={Colors.success} />
              <Text style={styles.resultTitle}>نتائج الفردات (6007)</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{optimization.sash.barsNeeded}</Text>
                <Text style={styles.statLabel}>عدد البارات</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, {color: Colors.success}]}>
                  {optimization.sash.efficiency.toFixed(1)}%
                </Text>
                <Text style={styles.statLabel}>الكفاءة</Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>الطول المطلوب:</Text>
                <Text style={styles.detailValue}>
                  {optimization.sash.totalLength.toFixed(1)} سم
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>الطول المتوفر:</Text>
                <Text style={styles.detailValue}>
                  {optimization.sash.barsNeeded * 650} سم
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>الهدر:</Text>
                <Text style={[styles.detailValue, {color: Colors.error}]}>
                  {optimization.sash.waste.toFixed(1)} سم
                </Text>
              </View>
            </View>
          </Card>

          {/* Summary */}
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Icon name="trending-up" size={24} color={Colors.white} />
              <Text style={styles.summaryTitle}>ملخص التحسين</Text>
            </View>

            <View style={styles.summaryStats}>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>
                  {optimization.frame.barsNeeded + optimization.sash.barsNeeded}
                </Text>
                <Text style={styles.summaryStatLabel}>إجمالي البارات</Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>
                  {(
                    (optimization.frame.efficiency + optimization.sash.efficiency) /
                    2
                  ).toFixed(1)}
                  %
                </Text>
                <Text style={styles.summaryStatLabel}>متوسط الكفاءة</Text>
              </View>
            </View>

            <View style={styles.tip}>
              <Text style={styles.tipText}>
                💡{' '}
                {optimization.frame.waste > 500 || optimization.sash.waste > 500
                  ? 'يمكن استخدام الهدر الكبير لصنع نوافذ إضافية صغيرة'
                  : 'كفاءة جيدة في استخدام المواد'}
              </Text>
            </View>
          </Card>
        </>
      ) : (
        <Card style={styles.emptyState}>
          <Icon name="build" size={64} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>احسب التحسين</Text>
          <Text style={styles.emptyText}>
            أدخل قائمة النوافذ المطلوبة واضغط "احسب التحسين" لمعرفة الكمية المثلى
            للمواد
          </Text>
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
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
  },
  windowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  windowTitle: {
    ...Typography.body,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputItem: {
    flex: 1,
  },
  calculateButton: {
    marginTop: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    ...Typography.h3,
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.gray50,
    borderRadius: 8,
  },
  statValue: {
    ...Typography.h2,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.small,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    ...Typography.small,
  },
  detailValue: {
    ...Typography.small,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: Colors.primary,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    ...Typography.h3,
    color: Colors.white,
    marginLeft: 8,
  },
  summaryStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  summaryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatValue: {
    ...Typography.h2,
    color: Colors.white,
  },
  summaryStatLabel: {
    ...Typography.small,
    color: Colors.white,
    opacity: 0.8,
  },
  tip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
  },
  tipText: {
    ...Typography.small,
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    ...Typography.h3,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    ...Typography.bodySecondary,
    textAlign: 'center',
  },
});

export default OptimizationTools;