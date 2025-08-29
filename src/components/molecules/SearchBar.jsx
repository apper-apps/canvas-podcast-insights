import { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search episodes, guests, companies...", 
  value = "",
  onChange,
  className,
  showButton = true
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localValue);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex gap-3", className)}>
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={localValue}
          onChange={handleInputChange}
          className="pl-10"
        />
      </div>
      {showButton && (
        <Button type="submit" size="md">
          <ApperIcon name="Search" className="w-4 h-4" />
        </Button>
      )}
    </form>
  );
};

export default SearchBar;