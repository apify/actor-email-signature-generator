interface UrlWithLabel {
    key: string;
    value: string;
}

export interface EmailSignatureInput {
    fullName: string;
    position: string;
    phoneNumber?: string;
    twitterUrl?: string;
    linkedInUrl?: string;
    githubUrl?: string;
    hubspotUrl?: string;
    otherUrls?: UrlWithLabel[];
    apifyUrlLabel?: string;
    apifyUrl?: string;
    shouldDisplayHiring?: boolean;
    shouldDisplayG2?: boolean;
    shouldDisplayGDPR?: boolean;
    shouldDisplaySOC2?: boolean;
    type: EmailSignatureType;
}

export enum EmailSignatureType {
    Gmail = 'Gmail',
    Outlook = 'Outlook',
}
