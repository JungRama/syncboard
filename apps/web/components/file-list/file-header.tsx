import { Button } from '@ui/components/ui/button';
import { Grid, List } from 'lucide-react';

export default function FileHeader() {
  return (
    <div className="flex justify-end gap-1 px-3 py-3">
      <Button>+ Workspace</Button>
      <Button className="px-2" variant="secondary">
        <Grid className="h-5" />
      </Button>
      <Button className="px-2" variant="secondary">
        <List className="h-5 text-muted-foreground" />
      </Button>
    </div>
  );
}
