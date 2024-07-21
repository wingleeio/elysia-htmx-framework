import Elysia, { type InferContext } from "elysia";
import type { Loader } from "@/plugins/pages";

/**
 * Define what context this page should be built with.
 * This can be used to guard the page, or providing necessary
 * services for this page to operate such as a database connection.
 *
 * @value {Elysia}
 * */
export const context = new Elysia().state("message", "Hello!");

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
        <div id="test" class="p-4">
            <h1>{message}</h1>
        </div>
    );
}
