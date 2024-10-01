import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";

const TimeAgo = ({ date, className="" }) => {
  const dateObj = new Date(date);
  const timeAgo = formatDistanceToNow(dateObj, { addSuffix: true });
  return <span className={className}>{timeAgo}</span>;
};

TimeAgo.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  className: PropTypes.string,
};

export default TimeAgo;