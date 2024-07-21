import { Elysia } from "elysia";
import { jsx } from "@/plugins/jsx";
import { pages } from "./plugins/pages";
import { staticPlugin } from "@/plugins/static";
import { tailwind } from "@gtramontina.com/elysia-tailwind";

new Elysia()
    .use(staticPlugin("public"))
    .use(
        tailwind({
            path: "/styles.css",
            source: "./src/index.css",
            config: "./tailwind.config.js",
        })
    )
    .use(jsx())
    .use(
        pages({
            metadata: {
                scripts: ["https://unpkg.com/htmx.org@2.0.1"],
                links: [{ rel: "stylesheet", href: "/styles.css" }],
            },
        })
    )
    .onStart(() => {
        if (process.env.NODE_ENV === "development") {
            fetch("http://localhost:10000");
            console.log("🦊 Triggering Live Reload");
        }
    })
    .listen(5001);
