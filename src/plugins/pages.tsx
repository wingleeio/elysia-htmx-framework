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
    const scripts = new Bun.Glob(`${directory}/**/+script.ts`);

    const entrypoints: string[] = [];

    const scriptMap = new Map<string, string>();

    for (const path of scripts.scanSync()) {
        entrypoints.push(path);
        scriptMap.set(
            path.replace("+script.ts", "+page.tsx"),
            path.replace(directory, "avocado").replace(".ts", ".js")
        );
    }

    const build = async () => {
        await Bun.build({
            entrypoints,
            outdir: "avocado",
            sourcemap: "external",
        });
    };

    await build();

    watch(directory, { recursive: true }, async (_, filename) => {
        if (filename === "+script.ts") {
            await build();
        }
    });

    for (const path of pages.scanSync()) {
        const url = path.replace(directory, "").replace("+page.tsx", "");
        const module: Page = await import(join(process.cwd(), path));

        const Component = module.default;
        const context = module.context ?? new Elysia();

        plugin.use(context).get(url, async (c) => {
            let props = {};
            let metadata = Object.assign({}, rest.metadata);
            let script = scriptMap.get(path);
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
                        {script && <script src={"./" + script} />}
                        {process.env.NODE_ENV === "development" && <script src="./avocado/hmr.js"></script>}
                    </body>
                </html>
            );
        });
    }

    const glob = new Bun.Glob(`avocado/**`);

    for (const path of glob.scanSync()) {
        plugin.get(path, () => new Response(Bun.file(path)));
    }

    return plugin;
};

interface Page {
    context?: Elysia;
    metadata?: (c: object) => Promise<object>;
    loader?: (c: object) => Promise<object>;
    default: (props: object) => JSX.Element;
}

export type Loader<T extends (...args: any) => any> = Awaited<ReturnType<T>>;
