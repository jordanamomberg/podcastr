import api from "./api";

export const episodes = () =>
  api
    .get("episodes", {
      params: {
        _limit: 12,
        _sort: "published_at",
        _order: "desc",
      },
    })
    .then((response) => response)
    .catch((error) => error.response);

export const episodesBySlug = (slug: string) =>
  api
    .get(`/episodes/${slug}`)
    .then((response) => response)
    .catch((error) => error.response);
