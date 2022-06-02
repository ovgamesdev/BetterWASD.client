import axios from "../axios";

const endpoint = {
  getEmote: () => axios.get(`/v1/profile/current`),
  getDashboardEmotes: (user_id) =>
    axios.get(
      `/v1/emote/dashboard/${typeof user_id !== "undefined" ? user_id : ""}`
    ),
  getUserEmotes: (id, limit, offset) =>
    axios.get("/v1/emote/user/" + id + "?limit=" + limit + "&offset=" + offset),
  getEmoteById: (id, user_id) =>
    axios.get(
      `/v1/emote/${id}/${typeof user_id !== "undefined" ? user_id : ""}`
    ),
  getGlobalEmotes: () => axios.get("/v1/emote/global"),
  getSharedEmotes: (limit, offset, search) =>
    axios.get(
      `/v1/emote/shared?limit=${limit}&offset=${offset}&query=${search}`
    ),
  getTopEmotes: (limit, offset, search) =>
    axios.get(`/v1/emote/top?limit=${limit}&offset=${offset}&query=${search}`),
  updateEmote: (id, data, user_id) =>
    axios.put(
      `/v1/emote/${id}/${typeof user_id !== "undefined" ? user_id : ""}`,
      data
    ),
  deleteEmote: (id, user_id) =>
    axios.delete(
      `/v1/emote/${id}/${typeof user_id !== "undefined" ? user_id : ""}`
    ),
  likeEmote: (id, user_id) =>
    axios.put(
      `/v1/emote/${id}/like/${typeof user_id !== "undefined" ? user_id : ""}`
    ),
  unlikeEmote: (id, user_id) =>
    axios.delete(
      `/v1/emote/${id}/like/${typeof user_id !== "undefined" ? user_id : ""}`
    ),
  postTvEmote: (data, user_id) =>
    axios.post(
      `/v1/emote/tv-emote/${typeof user_id !== "undefined" ? user_id : ""}`,
      data
    ),
  updateAlias: (id, alias, user_id) =>
    axios.put(
      `/v1/emote/${id}/alias/${typeof user_id !== "undefined" ? user_id : ""}`,
      { alias: alias }
    ),
  deleteAlias: (id, user_id) =>
    axios.delete(
      `/v1/emote/${id}/alias/${typeof user_id !== "undefined" ? user_id : ""}`
    ),
};

export default endpoint;
