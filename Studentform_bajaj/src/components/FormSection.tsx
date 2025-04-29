import React from "react";
import { FormSection, FormField } from "../types";

interface Props {
  section: FormSection;
  formValues: { [k: string]: any };
  errors: { [k: string]: string };
  onChange: (
    f: FormField,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const FormSectionComponent: React.FC<Props> = ({
  section,
  formValues,
  errors,
  onChange,
}) => (
  <div className="form-section">
    <h3>{section.title}</h3>
    {section.description && <p>{section.description}</p>}

    {section.fields.map((field) => (
      <div key={field.fieldId} className="form-field">
        <label htmlFor={field.fieldId}>
          {field.label} {field.required && "*"}
        </label>

        {(() => {
          switch (field.type) {
            case "textarea":
              return (
                <textarea
                  id={field.fieldId}
                  data-testid={field.dataTestId}
                  placeholder={field.placeholder}
                  value={formValues[field.fieldId]}
                  onChange={(e) => onChange(field, e)}
                />
              );
            case "dropdown":
              return (
                <select
                  id={field.fieldId}
                  data-testid={field.dataTestId}
                  value={formValues[field.fieldId]}
                  onChange={(e) => onChange(field, e)}
                >
                  <option value="">Select…</option>
                  {field.options?.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      data-testid={opt.dataTestId}
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              );
              case "radio":
                return (
                  <div className="options">
                    {field.options?.map((opt) => (
                      <label key={opt.value}>
                        <input
                          type="radio"
                          name={field.fieldId}
                          value={opt.value}
                          checked={formValues[field.fieldId] === opt.value}
                          onChange={(e) => onChange(field, e)}
                          data-testid={opt.dataTestId}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                );
              
              case "checkbox":
                return (
                  <div className="options">
                    {field.options?.map((opt) => (
                      <label key={opt.value}>
                        <input
                          type="checkbox"
                          name={field.fieldId}
                          value={opt.value}
                          checked={formValues[field.fieldId]?.includes(opt.value)}
                          onChange={(e) => onChange(field, e)}
                          data-testid={opt.dataTestId}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                );
                
            default:
              return (
                <input
                  id={field.fieldId}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formValues[field.fieldId]}
                  onChange={(e) => onChange(field, e)}
                  data-testid={field.dataTestId}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                />
              );
          }
        })()}

        {errors[field.fieldId] && (
          <p className="field-error">{errors[field.fieldId]}</p>
        )}
      </div>
    ))}
  </div>
);

export default FormSectionComponent;
