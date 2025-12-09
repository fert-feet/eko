import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@workspace/ui/components/button';

export const Route = createFileRoute('/test/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Button>
      button
    </Button>
  )
}
