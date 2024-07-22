import Html from "@kitajs/html";

export interface AlpineProps {
    as?: string;
    data?: string | object;
    text?: string;
    class?: string;
    model?: string;
    for?: string;
    if?: string;
    effect?: string;
    init?: string;
    children?: JSX.Element | JSX.Element[];
    click?: string;
    "click:outside"?: string;
    [key: `bind:${string}`]: string;
}

export const Alpine = (_props: AlpineProps) => {
    const props = Object.assign(
        {
            as: "div",
            data: {},
        },
        _props
    );
    const el = Html.createElement(
        props.as,
        {
            "x-data": JSON.stringify(props.data),
            "x-text": props.text,
            "x-for": props.for,
            "x-if": props.if,
            "x-on:click": props["click"],
            "x-on:click.outside": props["click:outside"],
            "x-model": props.model,
            "x-effect": props.effect,
            "x-init": props.init,
            class: props.class,
        },
        props.children
    );
    return el;
};

export const Value = (props: { expr: string; class: string }) => {
    return <Alpine as="span" text={props.expr} class={props.class} />;
};

export const For = (props: { expr: string; children: JSX.Element }) => {
    return (
        <Alpine as="template" for={props.expr}>
            {props.children}
        </Alpine>
    );
};

export const If = (props: { expr: string; children: JSX.Element }) => {
    return (
        <Alpine as="template" if={props.expr}>
            {props.children}
        </Alpine>
    );
};
