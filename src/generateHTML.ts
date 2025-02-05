import { EmailSignatureInput, EmailSignatureType } from "./types";

const sanitizeUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
        return 'https://' + url;
    }
    return url;
};

const generateLinksSection = (input: EmailSignatureInput) => {
    const urls = [
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

const typeToHtml = (input: EmailSignatureInput) => ({
    [EmailSignatureType.Gmail]: `<div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Ubuntu, 'Liberation Sans', Cantarell, 'DejaVu Sans', Oxygen-Sans, 'Noto Sans', 'Open Sans', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Verdana, Arial, sans-serif; font-size: 12px; font-weight: 400;">
        <div style="font-weight: 600; line-height: 18px;">${input.fullName
        }</div>
        <div style="line-height: 18px;">${input.position}</div>
        <div style="display: flex; align-items: center;">
            <a href="https://apify.com/">
                <img src="https://apify.com/ext/logo-for-signatures.png" 
                alt="Apify" style="margin-top: 12px; width:115px; margin-bottom: 12px;">
            </a>
        </div>
        ${input.phoneNumber
            ? `<div style="line-height: 18px;">${input.phoneNumber}</div>`
            : ""
        }
        ${generateLinksSection(input)}
        ${input.apifyUrl
            ? `<a href="${sanitizeUrl(input.apifyUrl)}" style="text-decoration: none;"><div style="line-height: 18px;">${input.apifyUrlLabel || 'Apify Profile'}</div></a>`
            : ""
        }
        <div style="line-height: 18px; margin-top: 12px;"><a href="https://apify.com" style="text-decoration: none; font-weight: 600;">Apify.com</a>${input.shouldDisplayHiring
            ? ` | <a href="https://apify.com/jobs" style="text-decoration: none;">We're hiring</a>`
            : ""
        }
        </div>
        
        ${input.shouldDisplayG2
            ? `<div style="display: flex; align-items: center;">
            <a href="https://www.g2.com/products/apify/reviews">
                <img src="https://apify.com/ext/g2badge.svg" 
                alt="G2 badge" style="margin-top: 12px; width:90px; margin-bottom: 12px;">
            </a>
        </div>`
            : ""
        }</div>`,
    [EmailSignatureType.Outlook]: `<div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Ubuntu, 'Liberation Sans', Cantarell, 'DejaVu Sans', Oxygen-Sans, 'Noto Sans', 'Open Sans', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Verdana, Arial, sans-serif; font-size: 12px; font-weight: 400;">
    <div style="font-weight: 600; line-height: 18px;">${input.fullName
        }</div>
    <div style="line-height: 18px;">${input.position}</div>
    <br style="line-height: 12px;"> 
    <a href="https://apify.com/"><img src="https://apify.com/ext/logo-for-signatures.png" 
        alt="Apify" style="width: 115px;"></a>
    <br style="line-height: 12px;"> 
    ${input.phoneNumber
            ? `<div style="line-height: 18px;">${input.phoneNumber}</div>`
            : ""
        }
    ${generateLinksSection(input)}
    ${input.apifyUrl
            ? `<a href="${sanitizeUrl(input.apifyUrl)}" style="text-decoration: none;"><div style="line-height: 18px;">${input.apifyUrlLabel || 'Apify Profile'}</div></a>`
            : ""
        }
    <br style="line-height: 12px;">
    <div style="line-height: 18px;"><a href="https://apify.com" style="text-decoration: none; font-weight: 600;">Apify.com</a>${input.shouldDisplayHiring
            ? ` | <a href="https://apify.com/jobs" style="text-decoration: none;">We're hiring</a>`
            : ""
        }
    </div>
    <br style="line-height: 12px;">
    ${input.shouldDisplayG2
            ? `
        <a href="https://www.g2.com/products/apify/reviews">
            <img src="https://apify.com/ext/g2badge.svg" 
            alt="G2 badge" style="width:90px;">
        </a>`
            : ""
        }
</div>`,
});

export default (input: EmailSignatureInput, type: EmailSignatureType) => {
    const result = typeToHtml(input)[type];
    return result;
};