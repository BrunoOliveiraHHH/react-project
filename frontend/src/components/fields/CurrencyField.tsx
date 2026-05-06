/**
 * CurrencyField — campo monetário (R$). Reutiliza NumberField com decimais=2 e prefixo "R$ ".
 * 🔁 Quasar: `q-input mask="#,##" prefix="R$"` ou um BaseCurrencyField.
 */
import { NumberField } from './NumberField';

interface CurrencyFieldProps {
  name: string;
  rotulo: string;
  desabilitado?: boolean;
  obrigatorio?: boolean;
}

export function CurrencyField({ name, rotulo, desabilitado, obrigatorio }: CurrencyFieldProps) {
  return (
    <NumberField
      name={name}
      rotulo={rotulo}
      desabilitado={desabilitado}
      obrigatorio={obrigatorio}
      decimais={2}
      prefixo="R$ "
      min={0}
    />
  );
}
