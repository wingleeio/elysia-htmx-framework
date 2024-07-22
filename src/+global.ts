import Alpine from "alpinejs";
import Swup from "swup";

Alpine.start();

const swup = new Swup();

swup.hooks.on("page:view", () => {
    htmx.process(document.getElementsByTagName("html")[0]!);
});
