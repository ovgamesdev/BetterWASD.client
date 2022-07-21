const Time = ({ className = "", format, date }) => {
  const time = new Date(date);

  const dd = time.getUTCDate();
  const mm = time.getUTCMonth();
  const yyyy = time.getUTCFullYear();

  const formatted = format
    .replace("DD", dd > 9 ? dd : "0" + dd)
    .replace("MM", mm > 9 ? mm : "0" + mm)
    .replace("YYYY", yyyy);

  return (
    <time className={className} dateTime={time.getTime()}>
      {formatted}
    </time>
  );
};

export default Time;
