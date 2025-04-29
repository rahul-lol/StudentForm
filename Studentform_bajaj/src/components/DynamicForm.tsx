import React, { useState, useEffect } from "react";
import { FormStructure, FormSection, FormField } from "../types";
import FormSectionComponent from "./FormSection";

interface Props {
  formStructure: FormStructure;
}

const DynamicForm: React.FC<Props> = ({ formStructure }) => {
  const { formTitle, sections } = formStructure;
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [formValues, setFormValues] = useState<{ [k: string]: any }>({});
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  // initialize empty values
  useEffect(() => {
    const init: { [k: string]: any } = {};
    sections.forEach((sec) =>
      sec.fields.forEach((f) => {
        init[f.fieldId] = f.type === "checkbox" ? [] : "";
      })
    );
    setFormValues(init);
  }, [sections]);

  const validateField = (f: FormField, v: any): string => {
    if (f.required) {
      if (
        (typeof v === "string" && !v.trim()) ||
        (Array.isArray(v) && v.length === 0)
      ) {
        return f.validation?.message || "This field is required";
      }
    }
    if (f.minLength && typeof v === "string" && v.length < f.minLength) {
      return f.validation?.message || `Minimum length is ${f.minLength}`;
    }
    if (f.maxLength && typeof v === "string" && v.length > f.maxLength) {
      return f.validation?.message || `Maximum length is ${f.maxLength}`;
    }
    if (f.type === "email" && v) {
      const re = /^\S+@\S+\.\S+$/;
      if (!re.test(v)) return f.validation?.message || "Invalid email";
    }
    if (f.type === "tel" && v) {
      const re = /^[0-9]+$/;
      if (!re.test(v)) return f.validation?.message || "Invalid phone";
    }
    return "";
  };

  const validateSection = (sec: FormSection) => {
    const errs: { [k: string]: string } = {};
    sec.fields.forEach((f) => {
      const e = validateField(f, formValues[f.fieldId]);
      if (e) errs[f.fieldId] = e;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    field: FormField,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    const checked = target.type === 'checkbox' ? target.checked : undefined;
    
    setFormValues((prev) => {
      const next = { ...prev };
      if (field.type === "checkbox" && field.options) {
        const arr = prev[field.fieldId] as string[];
        if (checked) next[field.fieldId] = [...arr, value];
        else next[field.fieldId] = arr.filter((x) => x !== value);
      } else {
        next[field.fieldId] = value;
      }
      return next;
    });
  };

  const goNext = () => {
    if (validateSection(sections[currentSectionIdx])) {
      setCurrentSectionIdx((i) => i + 1);
      setErrors({});
    }
  };
  const goPrev = () => {
    setCurrentSectionIdx((i) => i - 1);
    setErrors({});
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSection(sections[currentSectionIdx])) {
      console.log("Collected Form Data:", formValues);
      alert("Form submitted! Check console for data.");
    }
  };

  const isLast = currentSectionIdx === sections.length - 1;
  const section = sections[currentSectionIdx];

  return (
    <div className="dynamic-form">
      <h2>{formTitle}</h2>
      <form onSubmit={onSubmit}>
        <FormSectionComponent
          section={section}
          formValues={formValues}
          errors={errors}
          onChange={handleChange}
        />
        <div className="nav-buttons">
          {currentSectionIdx > 0 && (
            <button type="button" onClick={goPrev}>
              Previous
            </button>
          )}
          {!isLast && (
            <button type="button" onClick={goNext}>
              Next
            </button>
          )}
          {isLast && <button type="submit">Submit</button>}
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;
