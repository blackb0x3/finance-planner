const formatUnitOfTime = (diffAmount: number, unitOfTime: string): string => {
  return `${diffAmount} ${unitOfTime}${diffAmount === 1 ? '' : 's'} ago`;
}

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'less than a minute ago';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return formatUnitOfTime(diffInMinutes, 'minute');
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return formatUnitOfTime(diffInHours, 'minute');;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return formatUnitOfTime(diffInDays, 'day');
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return formatUnitOfTime(diffInWeeks, 'week');
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return formatUnitOfTime(diffInMonths, 'month');
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return formatUnitOfTime(diffInYears, 'year');
};