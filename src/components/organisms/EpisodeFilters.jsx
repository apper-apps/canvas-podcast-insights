import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import DateRangePicker from "@/components/molecules/DateRangePicker";
import ApperIcon from "@/components/ApperIcon";

const EpisodeFilters = ({ episodes = [], onFiltersChange, className }) => {
  const [filters, setFilters] = useState({
    guest: "",
    company: "",
    startDate: "",
    endDate: "",
    duration: ""
  });

  // Generate filter options from episodes
const guestOptions = [...new Set(episodes.map(ep => ep.guest_name_c))]
    .filter(Boolean)
    .sort()
    .map(guest => ({ value: guest, label: guest }));

  const companyOptions = [...new Set(episodes.map(ep => ep.company_c))]
    .filter(Boolean)
    .sort()
    .map(company => ({ value: company, label: company }));

  const durationOptions = [
    { value: "", label: "All durations" },
    { value: "short", label: "Short (< 30 min)" },
    { value: "medium", label: "Medium (30-60 min)" },
    { value: "long", label: "Long (> 60 min)" }
  ];

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      guest: "",
      company: "",
      startDate: "",
      endDate: "",
      duration: ""
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <ApperIcon name="Filter" className="w-5 h-5" />
          Filters
        </h3>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-slate-500 hover:text-slate-700"
          >
            <ApperIcon name="X" className="w-4 h-4 mr-2" />
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <FilterDropdown
          label="Guest"
          options={[{ value: "", label: "All guests" }, ...guestOptions]}
          value={filters.guest}
          onChange={(value) => handleFilterChange("guest", value)}
          placeholder="Select guest"
        />

        <FilterDropdown
          label="Company"
          options={[{ value: "", label: "All companies" }, ...companyOptions]}
          value={filters.company}
          onChange={(value) => handleFilterChange("company", value)}
          placeholder="Select company"
        />

        <DateRangePicker
          label="Date Range"
          startDate={filters.startDate}
          endDate={filters.endDate}
          onStartDateChange={(value) => handleFilterChange("startDate", value)}
          onEndDateChange={(value) => handleFilterChange("endDate", value)}
        />

        <FilterDropdown
          label="Duration"
          options={durationOptions}
          value={filters.duration}
          onChange={(value) => handleFilterChange("duration", value)}
          placeholder="Select duration"
        />
      </div>

      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            Active filters: {Object.values(filters).filter(v => v).length}
          </div>
        </div>
      )}
    </Card>
  );
};

export default EpisodeFilters;