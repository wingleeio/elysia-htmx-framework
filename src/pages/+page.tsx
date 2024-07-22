import { type InferContext } from "elysia";
import type { Loader } from "@/plugins/pages";
import { MainContext } from "@/context/MainContext";

/**
 * Define what context this page should be built with.
 * This can be used to guard the page, or providing necessary
 * services for this page to operate such as a database connection.
 *
 * @value {Elysia}
 * */
export const context = MainContext;

/**
 * Define the metadata for this page. This function will have access to
 * the context defined above.
 *
 * @value {Function}
 * */
export const metadata = async (c: InferContext<typeof context>) => {
    return {
        title: "Avocado - Demo",
        description: "This is a demo page for Avocado.",
    };
};

/**
 * Define the loader for this page.
 * This function will be called when the page is requested. It will
 * have access to the context defined above.
 *
 * @value {Function}
 * */
export const loader = async (c: InferContext<typeof context>) => {
    return {
        message: c.store.message,
    };
};

export default function Page({ message }: Loader<typeof loader>) {
    return (
        <div id="swup" class="p-4 flex flex-col gap-4">
            <h1 class="font-bold text-3xl transition-header">{message}</h1>
            <div class="flex flex-col gap-4 transition-main">
                <p>What is this?</p>
                <p>This is a demo page for Avocado.</p>
                <p id="random" hx-get="/api/random" hx-trigger="load"></p>
                <div>
                    <a href="/about" class="bg-slate-950 text-white px-4 py-2 rounded-md hover:bg-slate-800 text-sm">
                        About
                    </a>
                </div>
                <div>
                    <button
                        hx-get="/api/random"
                        hx-trigger="click"
                        hx-target="#random"
                        class="bg-slate-950 text-white px-4 py-2 rounded-md hover:bg-slate-800 text-sm"
                    >
                        Randomize
                    </button>
                </div>
            </div>
        </div>
    );
}
