import Swup from "swup";

const swup = new Swup();

swup.hooks.on("page:view", () => {
    htmx.process(document.getElementsByTagName("html")[0]!);
});
