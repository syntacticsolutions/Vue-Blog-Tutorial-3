const router = require("./src/router");
const fs = require("fs");
const path = require("path");

function getRoutesList(routes, pre) {
  return routes.reduce((array, route) => {
    const path = `${pre}${route.path}`;

    if (route.path !== "*") {
      array.push(path);
    }

    if (route.children) {
      array.push(...getRoutesList(route.children, `${path}/`));
    }

    return array;
  }, []);
}

let list = getRoutesList(router.options.routes, "https://www.ucjs.io")
  .map(route => `<url><loc>${route}</loc></url>`)
  .join("\r\n");
list = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${list}
  </urlset>`;

fs.writeFile(
  path.resolve(__dirname, "./public/sitemap.xml"),
  list,
  "utf8",
  () => {}
);
