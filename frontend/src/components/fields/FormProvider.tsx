/**
 * Formulario — wrapper sobre react-hook-form + zod.
 *
 * ✅ NÍVEL SÊNIOR:
 *   - Tipos derivados do schema via `z.infer<typeof schema>` no chamador.
 *   - Reset de form ao trocar entidade editada é resolvido com `key` prop
 *     no caller (re-monta o componente — padrão idiomático React) em vez
 *     do anti-padrão de subcomponente que chama `reset` em useEffect.
 *   - `mode: 'onBlur'` melhora UX: validação só após blur, evita "spam de erro".
 */
import { FormProvider as RHFProvider, useForm } from 'react-hook-form';
import type { DefaultValues, FieldValues, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';
import type { ReactNode } from 'react';

interface FormularioProps<T extends FieldValues> {
  schema: ZodType<T>;
  valoresIniciais: DefaultValues<T>;
  aoSubmeter: SubmitHandler<T>;
  children: ReactNode;
  formId?: string;
}

export function Formulario<T extends FieldValues>({
  schema,
  valoresIniciais,
  aoSubmeter,
  children,
  formId,
}: FormularioProps<T>) {
  const metodos = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: valoresIniciais,
    mode: 'onBlur',
  });

  return (
    <RHFProvider {...metodos}>
      <form id={formId} onSubmit={metodos.handleSubmit(aoSubmeter)} noValidate>
        {children}
      </form>
    </RHFProvider>
  );
}
