export default interface FormComponentModel<T> {
    initialData?: T;
    onSubmit: (formData: unknown) => void;
    onCancel: () => void;
    onUpdate?: (data: any) => void;
}