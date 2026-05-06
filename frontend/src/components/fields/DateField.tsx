/**
 * DateField — campo de data integrado ao react-hook-form.
 * 🔁 Quasar: `q-date` ou `q-input type="date"`.
 *
 * Salva no form como string ISO (YYYY-MM-DD) — formato que o backend aceita
 * via @DateTimeFormat ISO.
 */
import { DateInput } from '@mantine/dates';
import { Controller, useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';

interface DateFieldProps {
  name: string;
  rotulo: string;
  desabilitado?: boolean;
  obrigatorio?: boolean;
}

export function DateField({ name, rotulo, desabilitado, obrigatorio }: DateFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <DateInput
          label={rotulo}
          disabled={desabilitado}
          withAsterisk={obrigatorio}
          valueFormat="DD/MM/YYYY"
          clearable
          error={fieldState.error?.message}
          value={field.value ? dayjs(field.value as string).toDate() : null}
          onChange={(d) => field.onChange(d ? dayjs(d).format('YYYY-MM-DD') : undefined)}
          onBlur={field.onBlur}
          name={field.name}
        />
      )}
    />
  );
}
