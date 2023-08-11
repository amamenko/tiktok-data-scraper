import axios from "axios";

export const getBase64 = async (url: string) => {
  return await axios
    .get(url, {
      responseType: "arraybuffer",
    })
    .then((response) => Buffer.from(response.data, "binary").toString("base64"))
    .catch((e) => console.error(e));
};
