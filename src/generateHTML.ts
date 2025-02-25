import { EmailSignatureInput, EmailSignatureType } from "./types";

interface UrlObject {
    key: string;
    value: string | undefined;
}

const sanitizeUrl = (url: string | undefined): string => {
    if (!url) return '#';

    let o: string;

    if (/^https?:\/\//i.test(url)) {
        o = url;
    } else {
        o = 'https://' + url;
    }

    return o;
};

const generateLinksSection = (input: EmailSignatureInput): string => {
    const urls: UrlObject[] = [
        { key: "Twitter", value: input.twitterUrl },
        { key: "LinkedIn", value: input.linkedInUrl },
        { key: "GitHub", value: input.githubUrl },
        { key: "Book a meeting", value: input.hubspotUrl },
        ...(input.otherUrls ?? []),
    ];

    const urlsHtml = urls
        .filter((u) => u.value)
        .map(
            (u) =>
                `<a href="${sanitizeUrl(u.value)}" style="text-decoration: none;">${u.key}</a>`
        )
        .join(" | ");

    return `<div style="line-height: 18px;">${urlsHtml}</div>`;
};

const generateHeader = (): string => {
    return `<div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Ubuntu, 'Liberation Sans', Cantarell, 'DejaVu Sans', Oxygen-Sans, 'Noto Sans', 'Open Sans', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Verdana, Arial, sans-serif; font-size: 12px; font-weight: 400;">`;
};

const generateG2Badge = (): string => {
    return `
        <a title="Apify is a leader in Small-Business Data Extraction on G2" href="https://www.g2.com/products/apify/reviews?utm_source=rewards-badge">
            <img style="width: 125px;" alt="Apify is a leader in Small-Business Data Extraction on G2" src="https://images.g2crowd.com/uploads/report_medal_translation/image/22071/medal.svg" />
        </a>`;
};

const generateGDPRSoc2Badge = (): string => {
    return `
        <div style="margin-top: 12px;">
            <img style="width: 42px;" alt="AICPA SOC2" src="https://apify.com/ext/soc2.png" />
            <img style="width: 42px;" alt="GDPR" src="https://apify.com/ext/gdpr.png" />
        </div>
    `;
};

const typeToHtml = (input: EmailSignatureInput) => ({
    [EmailSignatureType.Gmail]: `
        ${generateHeader()}
            <div style="font-weight: 600; line-height: 18px;">${input.fullName}</div>

            <div style="line-height: 18px;">${input.position}</div>

            <div style="display: flex; align-items: center;">
                <a href="https://apify.com/" style="text-decoration: none;"><img src="https://apify.com/ext/logo-for-signatures-2025.png" alt="Apify" style="margin-top: 12px; width:115px; margin-bottom: 12px;"></a>
            </div>

            ${input.phoneNumber ? `<div style="line-height: 18px;">${input.phoneNumber}</div>` : ""}

            ${generateLinksSection(input)}

            ${input.apifyUrl ? `<a href="${sanitizeUrl(input.apifyUrl)}" style="text-decoration: none;"><div style="line-height: 18px;">${input.apifyUrlLabel || 'Apify Profile'}</div></a>` : ""}

            <div style="line-height: 18px; margin-top: 12px;">
                <a href="https://apify.com" style="text-decoration: none; font-weight: 600;">Apify.com</a>

                ${input.shouldDisplayHiring ? ` | <a href="https://apify.com/jobs" style="text-decoration: none;">We're hiring</a>` : ""}
            </div>

            ${generateGDPRSoc2Badge()}

            ${input.shouldDisplayG2 ? `<div style="display: flex; align-items: center;">${generateG2Badge()}</div>` : ""}
        </div>`,

    [EmailSignatureType.Outlook]: `
        ${generateHeader()}
            <div style="font-weight: 600; line-height: 18px;">${input.fullName}</div>

            <div style="line-height: 18px;">${input.position}</div>

            <br style="line-height: 12px;">

            <a href="https://apify.com/" style="text-decoration: none;"><img src="https://apify.com/ext/logo-for-signatures-2025.png" alt="Apify" style="width: 115px; margin-bottom: 12px;"></a>

            <br style="line-height: 12px;">

            ${input.phoneNumber ? `<div style="line-height: 18px;">${input.phoneNumber}</div>` : ""}

            ${generateLinksSection(input)}

            ${input.apifyUrl ? `<a href="${sanitizeUrl(input.apifyUrl)}" style="text-decoration: none;"><div style="line-height: 18px;">${input.apifyUrlLabel || 'Apify Profile'}</div></a>` : ""}

            <br style="line-height: 12px;">

            <div style="line-height: 18px;">
                <a href="https://apify.com" style="text-decoration: none; font-weight: 600;">Apify.com</a>

                ${input.shouldDisplayHiring ? ` | <a href="https://apify.com/jobs" style="text-decoration: none;">We're hiring</a>` : ""}
            </div>

            <br style="line-height: 12px;">

            ${generateGDPRSoc2Badge()}

            <br style="line-height: 12px;">

            ${input.shouldDisplayG2 ? `${generateG2Badge()}` : ''}
        </div>`,
});

export default (input: EmailSignatureInput, type: EmailSignatureType) => {
    return typeToHtml(input)[type];
};
