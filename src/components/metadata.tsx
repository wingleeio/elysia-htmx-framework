interface MetaProps {
    name?: string;
    content?: string;
    property?: string;
}

interface LinkProps {
    rel?: string;
    href?: string;
}

export interface MetadataProps {
    title?: string;
    description?: string;
    opengraph?: MetaProps[];
    scripts?: string[];
    meta?: MetaProps[];
    links?: LinkProps[];
}

export function Metadata({
    title,
    description,
    opengraph = [],
    scripts = [],
    meta = [],
    links = [],
}: MetadataProps): JSX.Element {
    return (
        <>
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}
            {meta.map((metaProps) => (
                <meta {...metaProps} />
            ))}
            {opengraph.map((og) => (
                <meta property={og.property} content={og.content} />
            ))}
            {links.map((linkProps) => (
                <link {...linkProps} />
            ))}
            {scripts.map((script) => (
                <script src={script} />
            ))}
        </>
    );
}
