import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import isEqual from "../../../lib/isEqual";

import ButtonLoading from "../Loading";

import "./editor-user.scss";

const EditorUser = (props) => {
  const [access, setAccess] = useState(props.user.access);

  useEffect(() => {
    !access && props.user.access && setAccess(props.user.access);
  }, [props.user.access, access]);

  const updateAccess = (user_id, access) => {
    setAccess(access);
    props.updateAccess(user_id, access);
  };

  const user = props.user.user || props.user.editor;

  if (props.loading) {
    return (
      <tr className="editor_user skelet-loading">
        <td>
          <div>
            <img
              src="data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7"
              alt="profile"
              className="loading"
            />
            <div className="editor_user-user_login loading" />
          </div>
        </td>
        <td>
          {typeof props.isLoadingRemove !== "undefined" && (
            <div>
              <div className="check-box_wrapper loading" />
              <div className="check-box_wrapper loading" />
              <div className="check-box_wrapper loading" />
            </div>
          )}
        </td>
        <td>
          {typeof props.isLoadingRemove !== "undefined" && (
            <div>
              <div className="button loading" />
              <div className="button loading" />
            </div>
          )}
        </td>
      </tr>
    );
  }

  return (
    <tr className="editor_user">
      <td>
        <div>
          <img src={user.channel_image} alt="avatar" />
          <Link to={"/users/" + user.user_id} className="editor_user-user_login">
            {user.user_login}
          </Link>
        </div>
      </td>
      <td>
        {typeof props.isLoadingRemove !== "undefined" && (
          <div>
            <div data-tip="управление значками подписчика" className="check-box_wrapper">
              <input type="checkbox" checked={props.user.access?.canSubBadges} onChange={(e) => props.setAccess({ ...props.user.access, canSubBadges: e.target.checked }, props.user._id)} />
            </div>
            <div data-tip="управление оповещениями" className="check-box_wrapper">
              <input type="checkbox" checked={props.user.access?.canAlertBox} onChange={(e) => props.setAccess({ ...props.user.access, canAlertBox: e.target.checked }, props.user._id)} />
            </div>
            <div data-tip="доступ к загрузке/удалению файлов (можно использовать ссылку)" className="check-box_wrapper">
              <input type="checkbox" checked={props.user.access?.canUploadFile} onChange={(e) => props.setAccess({ ...props.user.access, canUploadFile: e.target.checked }, props.user._id)} />
            </div>
            <ReactTooltip />
          </div>
        )}
      </td>
      <td className="flat-btn">
        {typeof props.isLoadingRemove !== "undefined" && (
          <div>
            <button onClick={() => updateAccess(user.user_id, props.user.access)} className="primary small" disabled={isEqual(access, props.user.access)}>
              {props.isLoadingAccess === user.user_id ? <ButtonLoading /> : "ok"}
            </button>

            <button onClick={() => props.deleteEditor(user.user_id)} disabled={props.isLoadingRemove === user.user_id} className="warning small">
              {props.isLoadingRemove === user.user_id ? <ButtonLoading /> : "x"}
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default EditorUser;
