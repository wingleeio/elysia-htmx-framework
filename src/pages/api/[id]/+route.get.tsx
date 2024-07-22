import type { InferContext } from "elysia";
import { MainContext } from "@/context/MainContext";

/**
 * Define what context this route should be built with.
 * This can be used to guard the route, or providing necessary
 * services for this route to operate such as a database connection.
 *
 * @value {Elysia}
 * */
export const context = MainContext;

export default function route(c: InferContext<typeof context>) {
    return c.params;
}
