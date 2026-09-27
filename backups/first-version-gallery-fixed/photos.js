const imageModules = import.meta.glob("../assets/photos/*", {
  eager: true,
  query: "?url",
  import: "default",
});

export const photos = Object.entries(imageModules)
  .filter(([path]) => /\.(png|jpe?g)$/i.test(path))
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
  .map(([path, src], index) => {
    const fileName = path.split("/").pop();
    const title = fileName.replace(/\.(png|jpg|jpeg)$/i, "").replace(/[-_]/g, " ");

    return {
      id: `${index}-${fileName}`,
      title,
      src,
    };
  });
