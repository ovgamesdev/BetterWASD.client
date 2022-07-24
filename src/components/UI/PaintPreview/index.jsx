const userColors = ["#7fba40", "#1c3fc8", "#a5276d", "#913ca7", "#4332b6", "#266bc5", "#5bc3c1", "#d87539", "#a9ad47", "#3ca13b", "#4db89a", "#6a4691", "#f5a623", "#e7719e", "#9fcbef", "#7b4b4b"];

const PaintPreview = ({ paint = "", user_login, user_id }) => {
  return (
    <>
      {paint.toString().length < 3 ? (
        <span>
          <span data-betterwasya-paint={paint} style={{ color: userColors[user_id % (userColors.length - 1)] }}>
            {user_login}
          </span>
        </span>
      ) : !!paint.toString().match("gradient")?.length ? (
        <span data-betterwasya-paint="" style={{ backgroundImage: paint }}>
          {user_login}
        </span>
      ) : (
        <span data-betterwasya-paint="" style={{ color: paint }}>
          {user_login}
        </span>
      )}
    </>
  );
};

export default PaintPreview;
