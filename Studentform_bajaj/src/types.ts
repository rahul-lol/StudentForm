// define our API/form data shapes

export interface FieldOption {
  value: string;
  label: string;
  dataTestId?: string;
}

export interface FormField {
  fieldId: string;
  type:
    | "text"
    | "tel"
    | "email"
    | "textarea"
    | "date"
    | "dropdown"
    | "radio"
    | "checkbox";
  label: string;
  placeholder?: string;
  required: boolean;
  dataTestId: string;
  validation?: {
    message: string;
  };
  options?: FieldOption[];
  maxLength?: number;
  minLength?: number;
}

export interface FormSection {
  sectionId: number;
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormStructure {
  formTitle: string;
  formId: string;
  version: string;
  sections: FormSection[];
}

export interface FormResponse {
  message: string;
  form: FormStructure;
}
