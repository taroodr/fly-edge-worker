import cache from "@fly/v8env/lib/fly/cache";

export const purgeCache = async function(req: Request) {
  if (req.method === "POST") {
    const body = await req.json();
    const tagName = body.tagName;
    const isPurged: boolean = await cache.global.purgeTag(tagName);
    return new Response(JSON.stringify(isPurged));
  }
};
