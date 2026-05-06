/**
 * ConfirmacaoRemocaoModal — modal de confirmação reutilizável.
 *
 * 🔁 PARALELO Vue/Quasar: `Dialog.create({ message, ok, cancel })` do Quasar.
 *
 * 💡 POR QUE COMPONENTE:
 *  - Toda página de listagem precisa pedir confirmação antes de DELETE.
 *  - Em vez de duplicar 5x, encapsulamos.
 */
import { Button, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';

interface ConfirmacaoRemocaoModalProps {
  aberto: boolean;
  aoFechar: () => void;
  aoConfirmar: () => void;
  mensagem?: string;
  carregando?: boolean;
}

export function ConfirmacaoRemocaoModal({
  aberto,
  aoFechar,
  aoConfirmar,
  mensagem,
  carregando,
}: ConfirmacaoRemocaoModalProps) {
  const { t } = useTranslation();
  return (
    <Modal
      aberto={aberto}
      aoFechar={aoFechar}
      titulo={t('comum.confirmar')}
      tamanho="sm"
      rodape={
        <>
          <Button variant="default" onClick={aoFechar} disabled={carregando}>
            {t('comum.cancelar')}
          </Button>
          <Button color="red" onClick={aoConfirmar} loading={carregando}>
            {t('comum.remover')}
          </Button>
        </>
      }
    >
      <Text>{mensagem ?? t('comum.confirmacaoRemocao')}</Text>
    </Modal>
  );
}
