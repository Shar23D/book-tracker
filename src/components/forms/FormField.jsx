import React from "react";

const FormField = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        {children}
    </div>
);

export default FormField;
