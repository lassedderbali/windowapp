import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../styles/colors';
import {Typography} from '../styles/typography';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import Picker from './Picker';
import {materialsData, type Material} from '../data/materials';

const MaterialsDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [materials, setMaterials] = useState<Material[]>(materialsData);

  const categories = [
    {value: 'all', label: 'جميع المواد'},
    {value: 'profiles', label: 'البروفايل'},
    {value: 'hardware', label: 'الملحقات'},
    {value: 'glass', label: 'الزجاج'},
    {value: 'joints', label: 'المواد اللاصقة'},
  ];

  const getCategoryForRef = (ref: string) => {
    if (ref.startsWith('40') || ref.startsWith('22') || ref.startsWith('60'))
      return 'profiles';
    if (ref.includes('joint') || ref.includes('plat')) return 'joints';
    if (ref.includes('glass') || ref.includes('زجاج')) return 'glass';
    return 'hardware';
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch =
      material.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.ref.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' ||
      getCategoryForRef(material.ref) === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colorMap = {
      profiles: Colors.primary,
      hardware: Colors.success,
      joints: Colors.warning,
      glass: Colors.info,
    };
    return colorMap[category as keyof typeof colorMap] || Colors.primary;
  };

  const renderMaterialItem = ({item}: {item: Material}) => {
    const category = getCategoryForRef(item.ref);
    const categoryColor = getCategoryColor(category);
    const categoryLabel = categories.find(c => c.value === category)?.label;

    return (
      <Card style={styles.materialItem}>
        <View style={styles.materialHeader}>
          <View style={styles.materialInfo}>
            <View style={styles.materialTitleRow}>
              <Icon name="inventory" size={16} color={Colors.textSecondary} />
              <Text style={styles.materialRef}>{item.ref}</Text>
            </View>
            <Text style={styles.materialName}>{item.designation}</Text>
            <View
              style={[
                styles.categoryBadge,
                {backgroundColor: `${categoryColor}20`},
              ]}>
              <Text style={[styles.categoryText, {color: categoryColor}]}>
                {categoryLabel}
              </Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{item.prixUMoyen.toFixed(2)} د.ت</Text>
          </View>
        </View>
      </Card>
    );
  };

  const addMaterial = () => {
    Alert.alert(
      'إضافة مادة جديدة',
      'هذه الميزة ستكون متاحة في التحديث القادم',
      [{text: 'موافق'}],
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Card>
        <Text style={styles.title}>قاعدة بيانات المواد</Text>
        <Text style={styles.subtitle}>
          إدارة أسعار وبيانات المواد المستخدمة في تصنيع النوافذ
        </Text>
      </Card>

      {/* Controls */}
      <Card>
        <Input
          placeholder="ابحث عن المواد..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />

        <View style={styles.controlsRow}>
          <Picker
            value={filterCategory}
            options={categories}
            onValueChange={setFilterCategory}
            containerStyle={styles.filterPicker}
          />
          <Button
            title="إضافة مادة"
            onPress={addMaterial}
            icon="add"
            size="small"
          />
        </View>
      </Card>

      {/* Statistics */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{materials.length}</Text>
          <Text style={styles.statLabel}>إجمالي المواد</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>
            {materials.filter(m => getCategoryForRef(m.ref) === 'profiles').length}
          </Text>
          <Text style={styles.statLabel}>البروفايل</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>
            {materials.filter(m => getCategoryForRef(m.ref) === 'hardware').length}
          </Text>
          <Text style={styles.statLabel}>الملحقات</Text>
        </Card>
      </View>

      {/* Materials List */}
      <FlatList
        data={filteredMaterials}
        renderItem={renderMaterialItem}
        keyExtractor={item => item.ref}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card style={styles.emptyState}>
            <Icon name="inventory" size={48} color={Colors.textLight} />
            <Text style={styles.emptyText}>لا توجد مواد تطابق البحث</Text>
          </Card>
        }
      />
    </View>
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
  searchInput: {
    marginBottom: 16,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  filterPicker: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.small,
  },
  materialItem: {
    marginVertical: 4,
  },
  materialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  materialInfo: {
    flex: 1,
  },
  materialTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  materialRef: {
    ...Typography.body,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  materialName: {
    ...Typography.small,
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    ...Typography.price,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    ...Typography.bodySecondary,
    marginTop: 16,
  },
});

export default MaterialsDatabase;