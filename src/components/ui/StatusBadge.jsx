import { STATUS } from '../../lib/status';

export default function StatusBadge({ status }) {
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS[status].cls}`}>{STATUS[status].label}</span>;
}
