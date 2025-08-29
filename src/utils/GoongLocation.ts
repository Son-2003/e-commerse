// utils/goongApi.ts
import axios from "axios";

const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY;


export const fetchAddressSuggestions = async (input: string) => {
  if (!input.trim()) return [];
  try {
    const res = await axios.get(
      `https://rsapi.goong.io/v2/place/autocomplete`,
      {
        params: {
          api_key: GOONG_API_KEY,
          input,
        },
      }
    );
    return res.data.predictions || [];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};
