import { purgeCache } from "./src/purgeCache";
import { cacheQuery } from "./src/cacheQuery";

const mounts = {
  "/purge": purgeCache,
  "/": cacheQuery
};

// routing
const routeMounts = async (req: Request) => {
  const url = new URL(req.url);
  for (const path of Object.getOwnPropertyNames(mounts)) {
    const backend: (req: Request) => Promise<Response> = mounts[path];

    // handle routing
    if (url.pathname === path || url.pathname.startsWith(path + "/")) {
      return await backend(req);
    }
  }

  return new Response("not found", { status: 404 });
};

// @ts-ignore
fly.http.respondWith(routeMounts);
