import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Emote from "../components/UI/Emote";

import useMeta from "../hooks/useMeta/index.tsx";
import api from "../services/api/index.js";

const Emotes = () => {
  const { id } = useParams();

  const [isFirsLoading, setIsFirsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    sharedEmotes: Array(40).fill({}),
    channelEmotes: [],
    personalEmotes: [],
  });

  useMeta({ title: `BetterWASYA | Профиль ${data?.user_login ? "| " + data?.user_login : ""}` }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.emote.getUserEmotes(id, 0, 0);
        setData(res);
      } catch (e) {
        console.log(e);
        setError(e);
      } finally {
        setIsFirsLoading(false);
      }
    };

    fetchData();
    // document.querySelector('.wrapper')?.scrollTo({top: 0, left: 0})
  }, [id]);

  return (
    <section className="question-section" style={{ paddingBottom: "160px" }}>
      {error && error.message && <div className="items">{error.message}</div>}

      {!error ? (
        <div className="items">
          <div className="item block item_right">
            <div className="item__title">
              Эмоции пользователя{" "}
              <a target="_blank" rel="noreferrer" href={"https://wasd.tv/" + data?.user_login}>
                {data?.user_login}
              </a>
            </div>
            <div className="item__descr">Эмоции доступны на этом канале с BetterWASYA.</div>
            <div className="item__border" />

            {!!data.personalEmotes?.length && (
              <>
                <div className="item__title">Персональные эмоции ({data.personalEmotes.length})</div>
                <div className="emotes" style={{ marginBottom: "25px" }}>
                  {data.personalEmotes.map((emote, index) => (
                    <Emote key={emote._id || index} emote={emote} loading={isFirsLoading} />
                  ))}
                </div>
              </>
            )}

            {!!data.channelEmotes.length && (
              <>
                <div className="item__title">Эмоции канала ({data.channelEmotes.length})</div>
                <div className="emotes" style={{ marginBottom: "25px" }}>
                  {data.channelEmotes.map((emote, index) => (
                    <Emote key={emote._id || index} emote={emote} loading={isFirsLoading} />
                  ))}
                </div>
              </>
            )}

            {!!data.sharedEmotes.length && (
              <>
                <div className="item__title">Общие эмоции ({data.sharedEmotes.length})</div>
                <div className="emotes">
                  {data.sharedEmotes.map((emote, index) => (
                    <Emote showUsername={true} key={emote._id || index} emote={emote} loading={isFirsLoading} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="items">
          <div className="emotes">{data?.message}</div>
        </div>
      )}
    </section>
  );
};

export default Emotes;
