export const metadata = async () => {
    return {
        title: "Avocado - About",
    };
};

export default function Page() {
    return (
        <div id="swup" class="p-4 flex flex-col gap-4 transition-main">
            <h1 class="font-bold text-3xl">About</h1>
            <p>What is this?</p>
            <p>This is a demo page for Avocado.</p>
            <div>
                <a
                    href="/"
                    class="bg-slate-950 text-white px-4 py-2 rounded-md hover:bg-slate-800 text-sm"
                    data-swup-animation="left"
                >
                    Go back
                </a>
            </div>
        </div>
    );
}
