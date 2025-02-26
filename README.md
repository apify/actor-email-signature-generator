# Apify email signature generator

This actor generates an email signature for Apify team members based on the provided details.
The generated signature is available in the key-value store, with the key being "OUTPUT".
The format is HTML.

## Features

- Generates professional email signatures for Gmail and Outlook
- Customizable personal information (name, position, phone number)
- Social media links (Twitter, LinkedIn, GitHub)
- Additional custom links with labels
- Apify profile link with custom label
- Optional "We're hiring" link
- Optional G2 badge
- Optional compliance badges (GDPR and SOC2) with links to documentation
- Color scheme that adapts to both light and dark modes in email clients
- Automatic URL sanitization (adds "https://" prefix if missing)

## Build requirements

- Node.js 20 (specified in the Dockerfile)
- Uses the `--legacy-peer-deps` flag for npm install to handle dependency conflicts

## Input parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `fullName` | String | **Required**. The full name displayed in the signature. |
| `position` | String | **Required**. Your position in Apify. |
| `phoneNumber` | String | Your phone number. |
| `twitterUrl` | String | The URL of your Twitter. |
| `linkedInUrl` | String | The URL of your LinkedIn. |
| `githubUrl` | String | The URL of your GitHub. |
| `hubspotUrl` | String | The URL for Hubspot meetings. |
| `otherUrls` | Array | Other URLs with custom labels. Each item has a `key` (label) and `value` (URL). |
| `apifyUrl` | String | The URL of your Apify profile. |
| `apifyUrlLabel` | String | Optional label for your Apify profile URL. Default is "Apify Profile". |
| `shouldDisplayHiring` | Boolean | **Required**. Determines whether the hiring link gets displayed. |
| `shouldDisplayG2` | Boolean | Determines whether the G2 banner gets displayed. |
| `shouldDisplayGDPR` | Boolean | Determines whether the GDPR compliance badge gets displayed. Default is `true`. |
| `shouldDisplaySOC2` | Boolean | Determines whether the SOC2 compliance badge gets displayed. Default is `true`. |
| `type` | String | **Required**. The signature type. Options: "Gmail" or "Outlook". Default is "Gmail". |

## Usage

1. Provide the required input parameters
2. Run the actor
3. Retrieve the HTML signature from the key-value store under the key "OUTPUT"
4. Copy and paste the HTML into your email client's signature settings

## URL formatting

All URLs in the signature are automatically processed:
- If a URL doesn't start with "http://" or "https://", the "https://" prefix is automatically added
- This means you can input URLs like "twitter.com/username" without needing to add the protocol

## Testing dark mode

The actor includes a testing tool to preview how the signature will look in both light and dark modes:

1. Run the `generate-test-page.js` script:

   ```bash
   node generate-test-page.js
   ```

2. Open the generated `dark-mode-test.html` file in your browser
3. Use the "Toggle Dark/Light Mode" button to switch between modes

For thorough testing, it's recommended to also test in actual email clients with dark mode enabled (Gmail, Apple Mail, Outlook).

## Compliance badges

The signature can include compliance badges for:

- **GDPR**: Links to <https://docs.apify.com/legal/gdpr-information>
- **SOC2**: Links to <https://trust.apify.com/>

These can be toggled individually using the `shouldDisplayGDPR` and `shouldDisplaySOC2` input parameters.

## Color scheme

The signature uses:

- Standard browser colors (black in light mode, white in dark mode) for name, position, and phone number
- A medium blue color (#6b89c9) for links that works reasonably well in both light and dark modes

## Example

```json
{
    "fullName": "John Doe",
    "position": "Software Engineer",
    "phoneNumber": "+1 (123) 456-7890",
    "twitterUrl": "twitter.com/johndoe",
    "linkedInUrl": "linkedin.com/in/johndoe",
    "githubUrl": "github.com/johndoe",
    "hubspotUrl": "meetings.hubspot.com/johndoe",
    "otherUrls": [
        {
            "key": "Facebook",
            "value": "facebook.com/johndoe"
        },
        {
            "key": "Personal Website",
            "value": "johndoe.com"
        }
    ],
    "apifyUrl": "apify.com/johndoe",
    "apifyUrlLabel": "My Apify Profile",
    "shouldDisplayHiring": true,
    "shouldDisplayG2": true,
    "shouldDisplayGDPR": true,
    "shouldDisplaySOC2": true,
    "type": "Gmail"
}
```
