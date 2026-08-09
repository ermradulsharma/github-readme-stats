// @ts-check

import { renderError } from "../src/common/render.js";
import { isLocaleAvailable } from "../src/translations.js";
import { renderGistCard } from "../src/cards/gist.js";
import { fetchGist } from "../src/fetchers/gist.js";
import {
  CACHE_TTL,
  resolveCacheSeconds,
  setCacheHeaders,
  setErrorCacheHeaders,
} from "../src/common/cache.js";
import { guardAccess } from "../src/common/access.js";
import {
  MissingParamError,
  retrieveSecondaryMessage,
} from "../src/common/error.js";
import { parseBoolean } from "../src/common/ops.js";
import { sanitizeQueryParam } from "../src/common/html.js";

// @ts-ignore
export default async (req, res) => {
  Object.keys(req.query).forEach((key) => {
    req.query[key] = sanitizeQueryParam(req.query[key]);
  });

  const {
    id,
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme,
    cache_seconds,
    locale,
    border_radius,
    border_color,
    show_owner,
    hide_border,
  } = req.query;

  res.setHeader("Content-Type", "image/svg+xml");

  const access = guardAccess({
    res,
    id,
    type: "gist",
    colors: {
      title_color,
      text_color,
      bg_color,
      border_color,
      theme,
    },
  });
  if (!access.isPassed) {
    return access.result;
  }

  if (locale && !isLocaleAvailable(locale)) {
    return res.send(
      renderError({
        message: "Something went wrong",
        secondaryMessage: "Language not found",
        renderOptions: {
          title_color,
          text_color,
          bg_color,
          border_color,
          theme,
        },
      }),
    );
  }

  try {
    const gistData = await fetchGist(id);
    const cacheSeconds = resolveCacheSeconds({
      requested: parseInt(cache_seconds, 10),
      def: CACHE_TTL.GIST_CARD.DEFAULT,
      min: CACHE_TTL.GIST_CARD.MIN,
      max: CACHE_TTL.GIST_CARD.MAX,
    });

    setCacheHeaders(res, cacheSeconds);

    return res.send(
      renderGistCard(gistData, {
        title_color: sanitizeQueryParam(title_color),
        icon_color: sanitizeQueryParam(icon_color),
        text_color: sanitizeQueryParam(text_color),
        bg_color: sanitizeQueryParam(bg_color),
        theme: sanitizeQueryParam(theme),
        border_radius: sanitizeQueryParam(border_radius),
        border_color: sanitizeQueryParam(border_color),
        locale: locale ? sanitizeQueryParam(locale.toLowerCase()) : null,
        show_owner: parseBoolean(show_owner),
        hide_border: parseBoolean(hide_border),
      }),
    );
  } catch (err) {
    if (err instanceof Error) {
      setErrorCacheHeaders(res);
      return res.send(
        renderError({
          message: err.message,
          secondaryMessage: retrieveSecondaryMessage(err),
          renderOptions: {
            title_color: sanitizeQueryParam(title_color),
            text_color: sanitizeQueryParam(text_color),
            bg_color: sanitizeQueryParam(bg_color),
            border_color: sanitizeQueryParam(border_color),
            theme: sanitizeQueryParam(theme),
            show_repo_link: !(err instanceof MissingParamError),
          },
        }),
      );
    }
    return res.send(
      renderError({
        message: "An unknown error occurred",
        renderOptions: {
          title_color,
          text_color,
          bg_color,
          border_color,
          theme,
        },
      }),
    );
  }
};
