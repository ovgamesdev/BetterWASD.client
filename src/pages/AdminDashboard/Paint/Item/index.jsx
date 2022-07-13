import PaintPreview from "../../../../components/UI/PaintPreview";

const PaintItem = ({ paint, removeHandler }) => {
  if (!paint.paint) return null;

  return (
    <tr className="paint__item">
      <td>
        <div className="center">{paint.paint.length < 3 ? paint.paint : ""}</div>
      </td>
      <td>
        <div className="preview">
          <PaintPreview paint={paint.paint} user_login={paint.user.user_login} user_id={paint.user_id} />
        </div>
      </td>
      <td>
        <div className="center">
          {new Date(paint.createdAt).toLocaleDateString().slice(0, 5)} / {new Date(paint.updatedAt).toLocaleDateString()}
        </div>
      </td>
      <td>
        <div className="center flat-btn">
          <button className="warning medium" onClick={() => removeHandler(paint._id, paint.user.user_login)}>
            del
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PaintItem;
