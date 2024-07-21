import { Metadata, type MetadataProps } from "@/avocado/metadata";

import Elysia from "elysia";
import { join } from "path";
import { watch } from "fs";

export const pages = async (config: { directory?: string; metadata?: MetadataProps }) => {
    const { directory, ...rest } = Object.assign(
        {
            directory: "src/pages",
            scripts: [],
            metadata: {
                title: "Avocado",
                meta: [{}],
            },
        },
        config
    );
    const plugin = new Elysia({
        name: "pages",
        seed: directory,
    });

    const pages = new Bun.Glob(`${directory}/**/+page.tsx`);
    const getRoutes = new Bun.Glob(`${directory}/**/+route.get.{ts,tsx}`);
    const postRoutes = new Bun.Glob(`${directory}/**/+route.post.{ts,tsx}`);
    const putRoutes = new Bun.Glob(`${directory}/**/+route.put.{ts,tsx}`);
    const patchRoutes = new Bun.Glob(`${directory}/**/+route.patch.{ts,tsx}`);
    const deleteRoutes = new Bun.Glob(`${directory}/**/+route.delete.{ts,tsx}`);

    const scriptMap = new Map<string, string>();

    const build = async () => {
        const globals = new Bun.Glob(`src/+global.ts`);

        const scripts = new Bun.Glob(`${directory}/**/+script.ts`);

        const entrypoints: string[] = [];

        for (const path of scripts.scanSync()) {
            entrypoints.push(path);
            scriptMap.set(
                path.replace("+script.ts", "+page.tsx"),
                path.replace(directory, "avocado").replace(".ts", ".js")
            );
        }

        for (const path of globals.scanSync()) {
            entrypoints.push(path);
            scriptMap.set("global", path.replace("src/", "avocado/").replace(".ts", ".js"));
        }

        if (entrypoints.length === 0) return;

        await Bun.build({
            entrypoints,
            outdir: "avocado",
            sourcemap: "external",
        });
    };

    await build();

    if (process.env.NODE_ENV === "development") {
        watch(directory, { recursive: true }, async (_, filename) => {
            if (filename === "+script.ts") {
                await build();
            }
        });

        watch("src/", async (_, filename) => {
            if (filename === "+global.ts") {
                await build();
            }
        });
    }

    for (const path of pages.scanSync()) {
        const url = path.replace(directory, "").replace("/+page.tsx", "") ?? "/";
        const module: Page = await import(join(process.cwd(), path));
        const Component = module.default;
        const context = module.context ?? new Elysia();

        plugin.use(context).get(url, async (c) => {
            let props = {};
            let metadata = Object.assign({}, rest.metadata);
            let script = scriptMap.get(path);
            let global = scriptMap.get("global");
            if (module.loader) props = await module.loader(c);
            if (module.metadata) metadata = Object.assign(metadata, await module.metadata(c));
            return (
                <html>
                    <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <Metadata {...metadata} />
                    </head>
                    <body>
                        <Component {...props} />
                        {global && <script src={"./" + global} />}
                        {script && <script src={"./" + script} />}
                        {process.env.NODE_ENV === "development" && <script src="./avocado/hmr.js"></script>}
                    </body>
                </html>
            );
        });
    }

    for (const path of getRoutes.scanSync()) {
        const url = path.replace(directory, "").replace(/\/\+route\.get\.(ts|tsx)$/, "") ?? "/";
        const module: Route = await import(join(process.cwd(), path));
        const context = module.context ?? new Elysia();
        plugin.use(context).get(url, module.default);
    }

    for (const path of postRoutes.scanSync()) {
        const url = path.replace(directory, "").replace(/\/\+route\.post\.(ts|tsx)$/, "") ?? "/";
        const module: Route = await import(join(process.cwd(), path));
        const context = module.context ?? new Elysia();
        plugin.use(context).post(url, module.default);
    }

    for (const path of putRoutes.scanSync()) {
        const url = path.replace(directory, "").replace(/\/\+route\.put\.(ts|tsx)$/, "") ?? "/";
        const module: Route = await import(join(process.cwd(), path));
        const context = module.context ?? new Elysia();
        plugin.use(context).put(url, module.default);
    }

    for (const path of patchRoutes.scanSync()) {
        const url = path.replace(directory, "").replace(/\/\+route\.patch\.(ts|tsx)$/, "") ?? "/";
        const module: Route = await import(join(process.cwd(), path));
        const context = module.context ?? new Elysia();
        plugin.use(context).patch(url, module.default);
    }

    for (const path of deleteRoutes.scanSync()) {
        const url = path.replace(directory, "").replace(/\/\+route\.delete\.(ts|tsx)$/, "") ?? "/";
        const module: Route = await import(join(process.cwd(), path));
        const context = module.context ?? new Elysia();
        plugin.use(context).delete(url, module.default);
    }

    const glob = new Bun.Glob(`avocado/**`);

    for (const path of glob.scanSync()) {
        plugin.get(path, () => new Response(Bun.file(path)));
    }

    return plugin;
};

interface Route {
    context?: Elysia;
    default: any;
}

interface Page {
    context?: Elysia;
    metadata?: (c: object) => Promise<object>;
    loader?: (c: object) => Promise<object>;
    default: (props: object) => JSX.Element;
}

export type Loader<T extends (...args: any) => any> = Awaited<ReturnType<T>>;
