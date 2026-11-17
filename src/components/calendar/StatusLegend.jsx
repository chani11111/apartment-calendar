import { STATUS } from '../../lib/status';
import StatusBadge from '../ui/StatusBadge';

export default function StatusLegend() {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {Object.keys(STATUS).map((s) => <StatusBadge key={s} status={s} />)}
    </div>
  );
}
