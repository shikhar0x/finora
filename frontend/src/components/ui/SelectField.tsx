import React, { useState, useRef, useEffect, useId } from "react";
import Icon, { type IconName } from "./Icon";

export interface SelectOption {
  value: string;
  label: string;
  icon?: IconName;
  badge?: string;
}

interface SelectFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  id?: string;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  required = false,
  id,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const selectId = id || generatedId;

  // Normalize options
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = normalizedOptions.findIndex((opt) => opt.value === value);
        const nextIndex = (currentIndex + 1) % normalizedOptions.length;
        onChange(normalizedOptions[nextIndex].value);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = normalizedOptions.findIndex((opt) => opt.value === value);
        const prevIndex = (currentIndex - 1 + normalizedOptions.length) % normalizedOptions.length;
        onChange(normalizedOptions[prevIndex].value);
      }
    }
  };

  return (
    <div className={`custom-select-container ${className}`} ref={containerRef}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}

      <div className="select-wrapper">
        <button
          id={selectId}
          ref={triggerRef}
          type="button"
          className={`select-trigger ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""}`}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
        >
          <span className="select-value-text">
            {selectedOption?.icon && (
              <Icon name={selectedOption.icon} size={15} className="select-item-icon" />
            )}
            <span className={!selectedOption ? "select-placeholder" : ""}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>

          <span className="select-arrow">
            <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={14} />
          </span>
        </button>

        {isOpen && (
          <ul
            className="select-dropdown-menu"
            role="listbox"
            aria-labelledby={selectId}
          >
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`select-option ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <div className="select-option-content">
                    {opt.icon && (
                      <Icon name={opt.icon} size={15} className="select-item-icon" />
                    )}
                    <span>{opt.label}</span>
                    {opt.badge && <span className="select-badge">{opt.badge}</span>}
                  </div>

                  {isSelected && (
                    <span className="select-check-icon">
                      <Icon name="check" size={14} strokeWidth={2.5} />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
