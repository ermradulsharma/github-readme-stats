// @ts-check

import { renderWakatimeCard } from "../src/cards/wakatime.js";

import { renderError } from "../src/common/render.js";
import { fetchWakatimeStats } from "../src/fetchers/wakatime.js";
import { isLocaleAvailable } from "../src/translations.js";
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
import { parseArray, parseBoolean } from "../src/common/ops.js";
import { sanitizeQueryParam } from "../src/common/html.js";

// @ts-ignore
export default async (req, res) => {
  Object.keys(req.query).forEach((key) => {
    req.query[key] = sanitizeQueryParam(req.query[key]);
  });

  const {
    username,
    title_color,
    icon_color,
    hide_border,
    card_width,
    line_height,
    text_color,
    bg_color,
    theme,
    cache_seconds,
    hide_title,
    hide_progress,
    custom_title,
    locale,
    layout,
    langs_count,
    hide,
    border_radius,
    border_color,
    display_format,
    disable_animations,
  } = req.query;

  res.setHeader("Content-Type", "image/svg+xml");

  const access = guardAccess({
    res,
    id: username,
    type: "wakatime",
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
    const stats = await fetchWakatimeStats({ username });
    const cacheSeconds = resolveCacheSeconds({
      requested: parseInt(cache_seconds, 10),
      def: CACHE_TTL.WAKATIME_CARD.DEFAULT,
      min: CACHE_TTL.WAKATIME_CARD.MIN,
      max: CACHE_TTL.WAKATIME_CARD.MAX,
    });

    setCacheHeaders(res, cacheSeconds);

    return res.send(
      renderWakatimeCard(stats, {
        custom_title: sanitizeQueryParam(custom_title),
        hide_title: parseBoolean(hide_title),
        hide_border: parseBoolean(hide_border),
        card_width: parseInt(card_width, 10),
        hide: parseArray(hide),
        line_height: sanitizeQueryParam(line_height),
        title_color: sanitizeQueryParam(title_color),
        icon_color: sanitizeQueryParam(icon_color),
        text_color: sanitizeQueryParam(text_color),
        bg_color: sanitizeQueryParam(bg_color),
        theme: sanitizeQueryParam(theme),
        hide_progress,
        border_radius: sanitizeQueryParam(border_radius),
        border_color: sanitizeQueryParam(border_color),
        locale: locale ? sanitizeQueryParam(locale.toLowerCase()) : null,
        layout: sanitizeQueryParam(layout),
        langs_count,
        display_format: sanitizeQueryParam(display_format),
        disable_animations: parseBoolean(disable_animations),
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
