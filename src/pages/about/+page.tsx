import { Alpine, For, If, Value } from "@/components/Alpine";

export const metadata = async () => {
    return {
        title: "Avocado - About",
    };
};

const Button = ({ click, children }: { click: string; children: JSX.Element }) => {
    return (
        <Alpine
            as="button"
            click={click}
            class="bg-slate-950 text-white px-4 py-2 rounded-md hover:bg-slate-800 text-sm"
        >
            {children}
        </Alpine>
    );
};

export default function Page() {
    return (
        <div id="swup" class="p-4 flex flex-col gap-4">
            <h1 class="font-bold text-3xl transition-header">About</h1>
            <div class="flex flex-col gap-4 transition-main">
                <p>What is this?</p>
                <p>This is a demo page for Avocado.</p>
                <Alpine data={{ count: 0 }} class="flex gap-2 items-center text-sm">
                    <Button click="count--">-</Button>
                    <Value expr="count" class="px-4 py-2 bg-slate-100 rounded-md" />
                    <Button click="count++">+</Button>
                    <If expr="count > 1">
                        <For expr="(x, i) in new Array(count)">
                            <Value expr="i + 1" class="px-4 py-2 bg-slate-100 rounded-md" />
                        </For>
                    </If>
                </Alpine>
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
        </div>
    );
}
