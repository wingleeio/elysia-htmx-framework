import Elysia from "elysia";

export const staticPlugin = (directory: string, prefix: string = "") => {
    const plugin = new Elysia({
        name: "static",
        seed: directory,
    });

    const glob = new Bun.Glob(`${directory}/**`);

    for (const path of glob.scanSync()) {
        plugin.get(prefix + path.substring(directory.length), () => new Response(Bun.file(path)));
    }

    return plugin;
};
