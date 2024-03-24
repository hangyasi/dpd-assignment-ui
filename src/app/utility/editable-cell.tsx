export default function EditableCell({ isEditing, value, onChange }: {
    isEditing: boolean;
    value: string;
    onChange: (newValue: string) => void;
}) {
    if (isEditing) {
        return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="p-2 border rounded" />;
    }
    return <span>{value}</span>;
};
