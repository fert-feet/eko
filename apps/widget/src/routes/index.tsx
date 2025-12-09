import { createFileRoute } from '@tanstack/react-router';
import WidgetView from '../../modules/widget/ui/views/widget-view';
import z from 'zod';

const widgetSearchSchema = z.object({
  organizationId: z.string().optional().catch('')
});

export const Route = createFileRoute('/')({
  validateSearch: (search) => widgetSearchSchema.parse(search),
  component: App,
});

function App() {
  const { organizationId } = Route.useSearch();

  const finalOrganizationId = organizationId ?? null

  return (
    <WidgetView organizationId={finalOrganizationId}/>
  );
}
