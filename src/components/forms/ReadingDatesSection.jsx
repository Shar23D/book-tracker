import React from "react";
import FormField from "./FormField";

const ReadingDatesSection = ({ book, onChange }) => {
  const handleDateChange = (index, field, value) => {
    const updatedDates = [...book.readingDates];
    updatedDates[index] = { ...updatedDates[index], [field]: value };
    onChange({ ...book, readingDates: updatedDates });
  };

  const addDateRange = () => {
    onChange({
      ...book,
      readingDates: [...book.readingDates, { start: "", end: "" }]
    });
  };

  const removeDateRange = (index) => {
    const updatedDates = book.readingDates.filter((_, i) => i !== index);
    onChange({ ...book, readingDates: updatedDates });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Reading Dates</label>

      {book.readingDates.map((range, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input
            type="date"
            value={range.start}
            onChange={(e) => handleDateChange(index, "start", e.target.value)}
            className="px-2 py-1 border rounded"
          />
          <span>-</span>
          <input
            type="date"
            value={range.end}
            onChange={(e) => handleDateChange(index, "end", e.target.value)}
            className="px-2 py-1 border rounded"
          />
          <button
            type="button"
            onClick={() => removeDateRange(index)}
            className="text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addDateRange}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Date Range
      </button>
    </div>
  );
};

export default ReadingDatesSection;
