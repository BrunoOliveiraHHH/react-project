/**
 * TextField — campo de texto integrado com react-hook-form via Controller.
 *
 * 📚 CONCEITO REACT: componente controlado dentro de um form gerenciado.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - `q-input` + `v-model="form.nome" :rules="[...]"` em Quasar.
 *  - Aqui o "v-model" é o `Controller` do react-hook-form, que conecta o
 *    estado do form ao input.
 *
 * 💡 POR QUE WRAPPER COM Controller:
 *  - O Mantine TextInput é "uncontrolled-friendly" e o react-hook-form
 *    funciona melhor com `register` em casos triviais. Mas para inputs
 *    customizados que precisam de `onChange` programático, `Controller` é o
 *    padrão recomendado.
 *  - Centraliza tradução de label, exibição de erro e estado disabled.
 *
 * 🌍 OUTROS CASOS DE USO:
 *  - Qualquer formulário > 3 campos se beneficia desse padrão. Para um único
 *    input solto, `useState` cru é suficiente.
 */
import { TextInput } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';

interface TextFieldProps {
  /** Nome do campo no form (path em react-hook-form). */
  name: string;
  rotulo: string;
  placeholder?: string;
  desabilitado?: boolean;
  obrigatorio?: boolean;
  type?: string;
}

export function TextField({
  name,
  rotulo,
  placeholder,
  desabilitado,
  obrigatorio,
  type = 'text',
}: TextFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextInput
          label={rotulo}
          placeholder={placeholder}
          disabled={desabilitado}
          withAsterisk={obrigatorio}
          type={type}
          error={fieldState.error?.message}
          {...field}
          value={(field.value as string | number | undefined) ?? ''}
        />
      )}
    />
  );
}
