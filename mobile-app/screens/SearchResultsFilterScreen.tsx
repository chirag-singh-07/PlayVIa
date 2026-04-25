import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { colors, typography } from "../theme";
import { layout } from "../constants";
import { ScreenWrapper } from "@/components/ScreenWrapper";

export const SearchResultsFilterScreen: React.FC<any> = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSort, setSelectedSort] = useState("relevance");
  const [selectedDuration, setSelectedDuration] = useState("any");

  const FilterGroup = ({ title, options, selectedValue, onSelect }: any) => (
    <View style={styles.filterGroup}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option: any) => {
          const isSelected = selectedValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.optionChip, isSelected && styles.selectedChip]}
              onPress={() => onSelect(option.value)}
            >
              <Text
                style={[styles.optionText, isSelected && styles.selectedText]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Filters</Text>
      </View>

      <View style={styles.content}>
        <FilterGroup
          title="Type"
          selectedValue={selectedType}
          onSelect={setSelectedType}
          options={[
            { label: "All", value: "all" },
            { label: "Videos", value: "videos" },
            { label: "Shorts", value: "shorts" },
            { label: "Channels", value: "channels" },
          ]}
        />

        <FilterGroup
          title="Sort by"
          selectedValue={selectedSort}
          onSelect={setSelectedSort}
          options={[
            { label: "Relevance", value: "relevance" },
            { label: "Upload date", value: "date" },
            { label: "View count", value: "views" },
            { label: "Rating", value: "rating" },
          ]}
        />

        <FilterGroup
          title="Duration"
          selectedValue={selectedDuration}
          onSelect={setSelectedDuration}
          options={[
            { label: "Any", value: "any" },
            { label: "Under 4 minutes", value: "short" },
            { label: "4 - 20 minutes", value: "medium" },
            { label: "Over 20 minutes", value: "long" },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Apply Filters"
          onPress={() => navigation.goBack()}
          style={styles.applyBtn}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.spacing.md,
    paddingTop: 50,
    paddingBottom: layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  closeBtn: {
    marginRight: layout.spacing.md,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as "700",
  },
  content: {
    flex: 1,
    padding: layout.spacing.md,
  },
  filterGroup: {
    marginBottom: layout.spacing.xl,
  },
  filterTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as "700",
    marginBottom: layout.spacing.sm,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: layout.borderRadius.full,
    backgroundColor: colors.dark.surface,
    marginRight: layout.spacing.sm,
    marginBottom: layout.spacing.sm,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  selectedChip: {
    backgroundColor: colors.dark.text,
    borderColor: colors.dark.text,
  },
  optionText: {
    color: colors.dark.text,
    fontSize: typography.sizes.sm,
  },
  selectedText: {
    color: colors.dark.background,
    fontWeight: typography.weights.bold as "700",
  },
  footer: {
    padding: layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  applyBtn: {
    width: "100%",
  },
});
