/**
 * NumberField — input numérico controlado por react-hook-form.
 * 🔁 Quasar: `q-input type="number"` + `v-model.number`.
 */
import { NumberInput } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';

interface NumberFieldProps {
  name: string;
  rotulo: string;
  placeholder?: string;
  desabilitado?: boolean;
  obrigatorio?: boolean;
  min?: number;
  max?: number;
  decimais?: number;
  prefixo?: string;
  sufixo?: string;
}

export function NumberField({
  name,
  rotulo,
  placeholder,
  desabilitado,
  obrigatorio,
  min,
  max,
  decimais = 0,
  prefixo,
  sufixo,
}: NumberFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <NumberInput
          label={rotulo}
          placeholder={placeholder}
          disabled={desabilitado}
          withAsterisk={obrigatorio}
          min={min}
          max={max}
          decimalScale={decimais}
          fixedDecimalScale={decimais > 0}
          prefix={prefixo}
          suffix={sufixo}
          decimalSeparator=","
          thousandSeparator="."
          error={fieldState.error?.message}
          value={(field.value as number | string | undefined) ?? ''}
          onChange={(v) => field.onChange(v === '' ? undefined : Number(v))}
          onBlur={field.onBlur}
          name={field.name}
        />
      )}
    />
  );
}
