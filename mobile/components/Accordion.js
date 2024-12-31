import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
} from 'react-native';

const Accordion = ({ title, children }) => {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    Animated.timing(animatedHeight, {
      toValue: accordionOpen ? 0 : 100,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setAccordionOpen(!accordionOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleAccordion}
        style={styles.header}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.content, { maxHeight: animatedHeight }]}>
        <View style={styles.innerContent}>{children}</View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  content: {
    overflow: 'hidden',
  },
  innerContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
  },
});

export default Accordion;