export default {
  name: "customLocalStorageMock",

  lookup: function lookup() {
    return "en_US";
  },
  cacheUserLanguage: function cacheUserLanguage(
    _: string,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {},
};
