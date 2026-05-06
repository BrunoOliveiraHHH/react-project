/**
 * Dashboard.tsx — Página inicial com resumo do ERP.
 */
import { useQuery } from '@tanstack/react-query';
import { Card, Grid, Loader, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { dashboardService } from '../api/dashboardService';
import { PageHeader } from '../components/ui/PageHeader';
import { queryKeys } from '../lib/queryKeys';
import { formatarMoeda } from '../lib/format';

export default function Dashboard() {
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.dashboard.resumo(),
    queryFn: () => dashboardService.obterResumo(),
  });

  return (
    <Stack>
      <PageHeader titulo={t('dashboard.titulo')} />

      {isLoading && <Loader />}
      {error && <Text c="red">Erro ao carregar.</Text>}

      {data && (
        <Grid>
          <Cartao titulo={t('dashboard.totalProdutos')} valor={String(data.totalProdutos)} />
          <Cartao titulo={t('dashboard.totalClientes')} valor={String(data.totalClientes)} />
          <Cartao titulo={t('dashboard.vendasHoje')} valor={String(data.vendasHoje)} />
          <Cartao
            titulo={t('dashboard.faturamentoHoje')}
            valor={formatarMoeda(data.faturamentoHoje)}
          />
        </Grid>
      )}
    </Stack>
  );
}

function Cartao({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
      <Card withBorder padding="lg">
        <Text size="sm" c="dimmed">
          {titulo}
        </Text>
        <Title order={2} mt="xs">
          {valor}
        </Title>
      </Card>
    </Grid.Col>
  );
}
