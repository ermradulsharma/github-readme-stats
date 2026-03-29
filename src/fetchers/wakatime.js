// @ts-check

import axios from "axios";
import { CustomError, MissingParamError } from "../common/error.js";

/**
 * WakaTime data fetcher.
 *
 * @param {{username: string }} props Fetcher props.
 * @returns {Promise<import("./types").WakaTimeData>} WakaTime data response.
 */
const fetchWakatimeStats = async ({ username }) => {
  if (!username) {
    throw new MissingParamError(["username"]);
  }

  try {
    const { data } = await axios.get(
      `https://${
        process.env.WAKATIME_API_DOMAIN
          ? process.env.WAKATIME_API_DOMAIN.replace(/\/$/gi, "")
          : "wakatime.com"
      }/api/v1/users/${encodeURIComponent(username)}/stats?is_including_today=true`,
    );

    return data.data;
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      err.response &&
      err.response.status === 404
    ) {
      throw new CustomError(
        `Could not resolve to a User with the login of '${username}'`,
        "WAKATIME_USER_NOT_FOUND",
      );
    }
    throw err;
  }
};

export { fetchWakatimeStats };
export default fetchWakatimeStats;
