import './components.css';

function formatAction(action) {
  if (!action) return 'did something with';

  const a = action.toLowerCase();

  if (a === 'favorite') return 'added';
  if (a === 'watch_later' || a === 'watchlater') return 'added';

  return 'did something with';
}

function formatSuffix(action) {
  if (!action) return '';

  const a = action.toLowerCase();

  if (a === 'favorite') return 'to favorites';
  if (a === 'watch_later' || a === 'watchlater') return 'to watch later';

  return '';
}

export default function Activity({ activity }) {
  if (!activity) return null;


  const username =
    activity.username ||
    (activity.user && activity.user.username) ||
    'User';

  const movieTitle =
    activity.movieTitle ||
    (activity.title && activity.title.title) ||
    activity.title ||
    '';

  const action = activity.activityType || activity.action || '';
  const date = activity.createdAt || activity.date || activity.updatedAt;
  const actionText = formatAction(action);
  const suffixText = formatSuffix(action);

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <li className="activity-item">
      <p className="activity-text">
        <span className="activity-user">{username}</span>{' '}
        {actionText}{' '}
        <span className="activity-title">{movieTitle}</span>{' '}
        {suffixText}
        {formattedDate && (
          <>
            {' '}
            - <span className="activity-date">{formattedDate}</span>
          </>
        )}
      </p>
    </li>
  );
}
