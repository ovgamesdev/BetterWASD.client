import api from "..";
import axios from "../axios";

const endpoint = {
  getEmote: () => axios.get(`/v1/profile/current`),
  getDashboardEmotes: (user_id: number) => axios.get(`/v1/emote/dashboard/${typeof user_id !== "undefined" ? user_id : ""}`),
  getUserEmotes: (id: any, limit: number, offset: number) => axios.get("/v1/emote/user/" + id + "?limit=" + limit + "&offset=" + offset),
  getEmoteById: (id: any, user_id: number) => axios.get(`/v1/emote/${id}/${typeof user_id !== "undefined" ? user_id : ""}`),

  getGlobalEmotes: (limit: number, offset: number, search: string) => axios.get(`/v1/emote/global?limit=${limit}&offset=${offset}&query=${search}`),
  getSharedEmotes: (limit: number, offset: number, search: string) => axios.get(`/v1/emote/shared?limit=${limit}&offset=${offset}&query=${search}`),
  getTopEmotes: (limit: number, offset: number, search: string) => axios.get(`/v1/emote/top?limit=${limit}&offset=${offset}&query=${search}`),

  updateEmote: (id: any, data: object, user_id: number) => axios.put(`/v1/emote/${id}/${typeof user_id !== "undefined" ? user_id : ""}`, data),
  deleteEmote: (id: any, user_id: number) => axios.delete(`/v1/emote/${id}/${typeof user_id !== "undefined" ? user_id : ""}`),

  likeEmote: (id: any, user_id: number) => axios.put(`/v1/emote/${id}/like/${typeof user_id !== "undefined" ? user_id : ""}`),
  unlikeEmote: (id: any, user_id: number) => axios.delete(`/v1/emote/${id}/like/${typeof user_id !== "undefined" ? user_id : ""}`),

  personalEmote: (id: any) => axios.put(`/v1/emote/${id}/personal`),
  unpersonalEmote: (id: any) => axios.delete(`/v1/emote/${id}/personal`),

  postTvEmote: (data: object, user_id: number) => axios.post(`/v1/emote/tv-emote/${typeof user_id !== "undefined" ? user_id : ""}`, data),

  updateAlias: (id: any, alias: string, user_id: number) => axios.put(`/v1/emote/${id}/alias/${typeof user_id !== "undefined" ? user_id : ""}`, { alias: alias }),
  deleteAlias: (id: any, user_id: number) => axios.delete(`/v1/emote/${id}/alias/${typeof user_id !== "undefined" ? user_id : ""}`),

  getUserEmotesById: (user_id: number) => axios.get(`/v1/users?user_id=${user_id}`),
  getUserEmotesByLogin: (user_login: string) => axios.get(`/v1/users?user_login=${user_login}`),

  getFullEmotes: async (user_id: number) => {
    const wasdEmotes = await api.wasd.smiles();
    const wasdSmiles = wasdEmotes
      .map((c) =>
        c.smiles.map((s) => ({
          _id: s.id,
          code: s.token,
          visibility_simple: [],
          url: { x1: s.image_url, x2: s.image_url_retina, x3: s.image_preview_url_retina },
          width: { x1: 28, x2: 28, x3: 28 },
          height: { x1: 28, x2: 28, x3: 28 },
        }))
      )
      .flat();

    const { data } = await api.emote.getUserEmotesById(user_id);

    const preRes = [...data.sharedEmotes, ...data.channelEmotes, ...data.global, ...wasdSmiles];
    const res = {};

    preRes.forEach((e) => {
      res[e.code] = e;
    });

    return { dataEmotes: res, dataSubBadges: data.subBadges };
  },
};

export default endpoint;
