import Elysia from "elysia";

const connections = new Set<any>();

function dispatch() {
    connections.forEach((connection) => {
        connection.send(true);
    });
}

await Bun.build({
    entrypoints: ["src/hmr.ts"],
    outdir: "avocado",
    sourcemap: "external",
});

new Elysia()
    .ws("/ws", {
        open(ws) {
            connections.add(ws);
        },
        close(ws) {
            connections.delete(ws);
        },
    })
    .get("/", () => {
        dispatch();
    })
    .onStart(() => {
        console.log(`🦊 Elysia HMR is running`);
    })
    .listen(10000);
