/**
 * SelectField — dropdown integrado ao react-hook-form.
 * 🔁 Quasar: `q-select` com `:options`.
 */
import { Select } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';

export interface OpcaoSelect {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  rotulo: string;
  opcoes: OpcaoSelect[];
  placeholder?: string;
  desabilitado?: boolean;
  obrigatorio?: boolean;
  /** Converter valor para number ao salvar (útil para FK numéricas). */
  numerico?: boolean;
}

export function SelectField({
  name,
  rotulo,
  opcoes,
  placeholder,
  desabilitado,
  obrigatorio,
  numerico = false,
}: SelectFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Select
          label={rotulo}
          placeholder={placeholder}
          disabled={desabilitado}
          withAsterisk={obrigatorio}
          data={opcoes}
          searchable
          clearable
          error={fieldState.error?.message}
          value={field.value != null ? String(field.value) : null}
          onChange={(v) => field.onChange(v == null ? undefined : numerico ? Number(v) : v)}
          onBlur={field.onBlur}
          name={field.name}
        />
      )}
    />
  );
}
