import Elysia from "elysia";

const isHTML = (response: {}) => {
    const htmlPattern = /<([a-z][\s\S]*>)/i;
    return typeof response === "string" && htmlPattern.test(response);
};

export const jsx = () => {
    return new Elysia({ name: "jsx" }).onAfterHandle(
        {
            as: "global",
        },
        (c) => {
            if (isHTML(c.response)) {
                c.set.headers["content-type"] = "text/html;charset=utf-8";
            }
        }
    );
};
