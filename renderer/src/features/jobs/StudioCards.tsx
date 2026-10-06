import { MediaCard } from './MediaCard';
import type { JobCardViewProps } from './JobCardView';

export function StudioCards({ jobs, deletingId, onOpen, onRequestDelete }: JobCardViewProps) {
  return <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{jobs.map(job =>
    <MediaCard key={job.id} job={job} onOpen={onOpen} onDelete={onRequestDelete} deleting={deletingId === job.id} />
  )}</div>;
}
