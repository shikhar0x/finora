import React, { useState, useRef, useEffect, useId } from "react";
import Icon from "./Icon";
import { formatDate } from "../../utils/formatters";

interface DateFieldProps {
  label?: string;
  value: string; // Format: YYYY-MM-DD
  onChange: (value: string) => void;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  id?: string;
}

export default function DateField({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select date",
  disabled = false,
  className = "",
  required = false,
  id,
}: DateFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const fieldId = id || generatedId;

  // Selected date parsed
  const selectedDate = value ? new Date(`${value}T00:00:00`) : new Date();

  // Viewing month/year in the calendar
  const [viewYear, setViewYear] = useState<number>(
    value ? selectedDate.getFullYear() : new Date().getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(
    value ? selectedDate.getMonth() : new Date().getMonth()
  );

  // Sync view when value changes
  useEffect(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        setViewYear(parseInt(parts[0], 10));
        setViewMonth(parseInt(parts[1], 10) - 1);
      }
    }
  }, [value]);

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

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekdayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (year: number, month: number, day: number) => {
    const yStr = String(year);
    const mStr = String(month + 1).padStart(2, "0");
    const dStr = String(day).padStart(2, "0");
    onChange(`${yStr}-${mStr}-${dStr}`);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleSelectToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    const yStr = String(today.getFullYear());
    const mStr = String(today.getMonth() + 1).padStart(2, "0");
    const dStr = String(today.getDate()).padStart(2, "0");
    onChange(`${yStr}-${mStr}-${dStr}`);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // Generate calendar days
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    calendarDays.push({
      day,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true,
    });
  }

  // Next month leading days to complete grid (42 cells = 6 weeks)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    calendarDays.push({
      day: i,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
    });
  }

  const today = new Date();
  const isToday = (year: number, month: number, day: number) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const isSelected = (year: number, month: number, day: number) => {
    if (!value) return false;
    const parts = value.split("-");
    return (
      parseInt(parts[0], 10) === year &&
      parseInt(parts[1], 10) - 1 === month &&
      parseInt(parts[2], 10) === day
    );
  };

  return (
    <div className={`custom-date-container ${className}`} ref={containerRef}>
      {label && (
        <label htmlFor={fieldId} className="date-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}

      <div className="date-wrapper">
        <button
          id={fieldId}
          ref={triggerRef}
          type="button"
          className={`date-trigger ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""}`}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-disabled={disabled}
        >
          <span className="date-value-text">
            <Icon name="calendar" size={15} className="date-input-icon" />
            <span className={!value ? "date-placeholder" : ""}>
              {value ? formatDate(value, "DD MMM YYYY") : placeholder}
            </span>
          </span>

          <span className="date-arrow">
            <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={14} />
          </span>
        </button>

        {isOpen && (
          <div className="date-popup-menu" role="dialog" aria-modal="false">
            {/* Header with Month/Year and navigation buttons */}
            <div className="calendar-header">
              <button
                type="button"
                className="calendar-nav-btn"
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                <Icon name="chevron-left" size={16} />
              </button>

              <div className="calendar-title">
                <strong>{monthNames[viewMonth]}</strong> {viewYear}
              </div>

              <button
                type="button"
                className="calendar-nav-btn"
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <Icon name="chevron-right" size={16} />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="calendar-weekdays">
              {weekdayNames.map((day) => (
                <div key={day} className="calendar-weekday-cell">
                  {day}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="calendar-grid">
              {calendarDays.map((cell, idx) => {
                const selected = isSelected(cell.year, cell.month, cell.day);
                const currentDay = isToday(cell.year, cell.month, cell.day);

                return (
                  <button
                    key={`${cell.year}-${cell.month}-${cell.day}-${idx}`}
                    type="button"
                    className={`calendar-day-btn ${
                      cell.isCurrentMonth ? "current-month" : "other-month"
                    } ${selected ? "selected-day" : ""} ${
                      currentDay ? "today-day" : ""
                    }`}
                    onClick={() => handleSelectDay(cell.year, cell.month, cell.day)}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>

            {/* Footer with Today action */}
            <div className="calendar-footer">
              <button
                type="button"
                className="calendar-today-btn"
                onClick={handleSelectToday}
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
