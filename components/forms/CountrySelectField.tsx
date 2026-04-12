'use client'

import { useState } from 'react'
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import countryList from 'react-select-country-list'
import 'flag-icons/css/flag-icons.min.css'

type CountrySelectProps<T extends FieldValues> = {
  name: Path<T>
  label: string
  control: Control<T>
  error?: FieldError
  required?: boolean
}

const CountrySelect = ({
  id,
  value,
  onChange,
  invalid,
  describedBy,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  invalid?: boolean
  describedBy?: string
}) => {
  const [open, setOpen] = useState(false)

  const countries = countryList().getData()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className="country-select-trigger"
        >
          {value ? (
            <span className="flex items-center gap-2">
              <span className={`fi fi-${value.toLowerCase()}`} />
              <span>{countries.find((c) => c.value === value)?.label}</span>
            </span>
          ) : (
            'Select your country...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full border-gray-600 bg-gray-800 p-0" align="start">
        <Command className="border-gray-600 bg-gray-800">
          <CommandInput placeholder="Search countries..." className="country-select-input" />
          <CommandEmpty className="country-select-empty">No country found.</CommandEmpty>
          <CommandList className="scrollbar-hide-default max-h-60 bg-gray-800">
            <CommandGroup className="bg-gray-800">
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={`${country.label} ${country.value}`}
                  onSelect={() => {
                    onChange(country.value)
                    setOpen(false)
                  }}
                  className="country-select-item"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 text-yellow-500',
                      value === country.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="flex items-center gap-2">
                    <span className={`fi fi-${country.value.toLowerCase()}`} />
                    <span>{country.label}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export const CountrySelectField = <T extends FieldValues>({
  name,
  label,
  control,
  error,
  required = false,
}: CountrySelectProps<T>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <CountrySelect
            id={String(name)}
            value={field.value}
            onChange={field.onChange}
            invalid={!!error}
            describedBy={`${name}-help ${error ? `${name}-error` : ''}`.trim()}
          />
        )}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="text-sm text-red-500">
          {error.message}
        </p>
      )}
      <p id={`${name}-help`} className="text-xs text-gray-500">
        Helps us show market data and news relevant to you.
      </p>
    </div>
  )
}
