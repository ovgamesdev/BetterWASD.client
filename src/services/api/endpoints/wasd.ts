import axios from "axios"; // no auth token

const endpoint = {
  getUserInfo: async (userName: string) => {
    try {
      const { data } = await axios.get(`https://wasd.tv/api/channels/nicknames/${userName}`);
      return Promise.resolve(data.result);
    } catch (e) {
      return Promise.reject();
    }
  },
  getProfileInfo: async (userId: number) => {
    try {
      const { data } = await axios.get(`https://wasd.tv/api/v2/profiles/${userId}`);
      return Promise.resolve(data.result);
    } catch (e) {
      return Promise.reject();
    }
  },
  getStreamId: async (channelId: number) => {
    try {
      const { data } = await axios.get(`https://wasd.tv/api/v2/media-containers?limit=1&offset=0&media_container_status=RUNNING,STOPPED&media_container_type=SINGLE&channel_id=${channelId}`);
      return Promise.resolve(data.result[0]?.media_container_streams[0].stream_id);
    } catch (e) {
      return Promise.reject();
    }
  },
  getChannelInfo: async (userName: string) => {
    try {
      const { data } = await axios.get(`https://wasd.tv/api/v2/broadcasts/public?channel_name=${userName}`);
      return Promise.resolve(data.result);
    } catch (e) {
      return Promise.reject();
    }
  },
  getJWTToken: async () => {
    try {
      const { data } = await axios.get(`https://wasd.tv/api/auth/chat-token`);
      return Promise.resolve(data.result);
    } catch (e) {
      return Promise.reject();
    }
  },
  getChannelInfoById: async (channel_id: number) => {
    try {
      const { data } = await axios.get(`https://wasd.tv/api/v2/broadcasts/public?with_extra=false&channel_id=${channel_id}`);
      return Promise.resolve(data.result);
    } catch (e) {
      return Promise.reject();
    }
  },
  smiles: async () => {
    try {
      const { data } = await axios.get(`https://static.wasd.tv/settings/smiles.json`);
      return Promise.resolve(data.result);
    } catch (e) {
      return Promise.reject();
    }
  },
};

export default endpoint;
