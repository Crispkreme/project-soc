import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const Table = ({
  columns,
  data,
  actions,
  onRowClick = () => {},
  noDataMessage = 'No records available.',
}) => {
  const renderRow = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onRowClick(item)}
      activeOpacity={0.7}
    >
      {columns.map((column) => (
        <Text key={column.key} style={styles.cell}>
          {column.render ? column.render(item[column.key], item) : item[column.key]}
        </Text>
      ))}
      {actions && (
        <View style={styles.actionCell}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                action.onClick(item);
              }}
            >
              {action.icon && <action.icon style={styles.icon} />}
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {columns.map((column) => (
          <Text key={column.key} style={styles.headerCell}>
            {column.label}
          </Text>
        ))}
        {actions && <Text style={styles.headerCell}>Action</Text>}
      </View>

      {/* Data Rows */}
      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderRow}
          keyExtractor={(item, index) => item.id || index.toString()}
        />
      ) : (
        <Text style={styles.noData}>{noDataMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  cell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#374151',
  },
  actionCell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  actionText: {
    color: '#3B82F6',
    fontSize: 14,
    marginLeft: 4,
  },
  icon: {
    fontSize: 16,
    color: '#3B82F6',
  },
  noData: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#9CA3AF',
  },
});

export default Table;