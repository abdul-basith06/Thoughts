import { format, formatDistanceToNow } from 'date-fns';

function formatThoughtDate(date) {
  const now = new Date();
  const thoughtDate = new Date(date);
  const diffInHours = (now - thoughtDate) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return `${formatDistanceToNow(thoughtDate, { addSuffix: true })}`;
  } else {
    return format(thoughtDate, "h:mm a '·' MMM d, yyyy");
  }
}

export default formatThoughtDate;
