import axios from "../axios";

const endpoint = {
  getProfile: (data: object) => axios.get("/v1/profile/current", data),
  checkToken: (data: object) => axios.post("/v1/check-token", data),
  getEditors: () => axios.get("/v1/profile/current/editors"),
  addEditor: (data: object) => axios.post("/v1/profile/current/editors", data),
  deleteEditor: (user_id: number) =>
    axios.delete("/v1/profile/current/editors/" + user_id),
  getSubscribeUrl: () => axios.post("/v1/subscription/subscribe"),
  getGiftSubscribeUrl: (data: object) => axios.post("/v1/subscription/gift", data),
  getSubscribe: () => axios.get("/v1/subscription"),
  
  getAlertSettings: () => axios.get("/v1/profile/current/alert"),
  getAlertSettingsByToken: (token: string) => axios.get("/v1/profile/current/alert/" + token),
  editAlertSettings: (data: any) => axios.put("/v1/profile/current/alert", data),
  getRaidInfo: async (channel_id: number) => {
    try {
      const { data } = await axios.get(`https://wasd.tv/api/v2/broadcasts/public?with_extra=false&channel_id=${channel_id}`)
      return Promise.resolve(data.result.channel.raid_info)
    } catch (e) {
      return Promise.reject()
    }
  },
};

export default endpoint;
