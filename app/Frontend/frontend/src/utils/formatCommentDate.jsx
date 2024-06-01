import { formatDistanceToNow } from "date-fns";


const formatCommentDate = (date) => {
    const distance = formatDistanceToNow(new Date(date), { addSuffix: true });
    const matches = distance.match(/(\d+)\s(\w+)/);
    if (matches) {
      const [, value, unit] = matches;
      switch (unit) {
        case "seconds":
          return `${value}s`;
        case "minutes":
          return `${value}m`;
        case "hours":
          return `${value}h`;
          case "day":
          return `${value}d`;
        case "days":
          return `${value}d`;
        case "weeks":
          return `${value}w`;
        case "months":
          return `${value}mo`;
        case "years":
          return `${value}y`;
        default:
          return distance;
      }
    }
    return distance;
}

export default formatCommentDate