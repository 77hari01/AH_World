const imageModules = import.meta.glob("../assets/photos/*.{png,jpg,jpeg,PNG,JPG,JPEG}", {
  eager: true,
  query: "?url",
  import: "default",
});

const previewModules = import.meta.glob("../assets/photo-previews/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});
const previewsByName = new Map(
  Object.entries(previewModules).map(([path, src]) => [path.split("/").pop(), src]),
);

export const photos = Object.entries(imageModules)
  .filter(([path]) => !/ - Copy\.(jpe?g|png)$/i.test(path))
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
  .map(([path, src], index) => {
    const fileName = path.split("/").pop();
    const title = fileName.replace(/\.(png|jpg|jpeg)$/i, "").replace(/[-_]/g, " ");
    const previewName = fileName.replace(/\.(png|jpg|jpeg)$/i, ".webp");

    return {
      id: `${index}-${fileName}`,
      title,
      src,
      textureSrc: previewsByName.get(previewName) ?? src,
    };
  });
