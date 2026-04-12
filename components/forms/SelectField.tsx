import { Controller } from 'react-hook-form'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SelectField = ({
  name,
  label,
  placeholder,
  options,
  control,
  error,
  required = false,
}: SelectFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLocaleLowerCase()}` : false,
        }}
        render={({ field }) => (
          <>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id={name}
                className="select-trigger"
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="border-gray-600 bg-gray-800 text-white" position="popper">
                {options.map((option) => (
                  <SelectItem
                    value={option.value}
                    key={option.value}
                    className="focus:bg-gray-600 focus:text-white"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p id={`${name}-error`} role="alert" className="text-sm text-red-500">
                {error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  )
}

export default SelectField
