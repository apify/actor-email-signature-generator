const fs = require('fs');
const path = require('path');

// Read the input.json file
const inputPath = path.join(process.cwd(), 'input.json');
const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Create a simplified version of the signature HTML based on the input
const generateSignatureHTML = (input) => {
    const linkColor = "#6b89c9";

    // Generate links section
    const urls = [
        { key: "Twitter", value: input.twitterUrl },
        { key: "LinkedIn", value: input.linkedInUrl },
        { key: "GitHub", value: input.githubUrl },
        { key: "Book a meeting", value: input.hubspotUrl },
        ...(input.otherUrls || []),
    ];

    const sanitizeUrl = (url) => {
        if (!url) return '#';
        return /^https?:\/\//i.test(url) ? url : 'https://' + url;
    };

    const urlsHtml = urls
        .filter((u) => u.value)
        .map(
            (u) =>
                `<a href="${sanitizeUrl(u.value)}" style="text-decoration: none; color: ${linkColor};">${u.key}</a>`
        )
        .join(" | ");

    // Generate compliance badges
    const badges = [];

    if (input.shouldDisplaySOC2 !== false) {
        badges.push(`<a href="https://trust.apify.com/" style="text-decoration: none;"><img style="width: 42px;" alt="AICPA SOC2" src="https://apify.com/ext/soc2.png" /></a>`);
    }

    if (input.shouldDisplayGDPR !== false) {
        badges.push(`<a href="https://docs.apify.com/legal/gdpr-information" style="text-decoration: none;"><img style="width: 42px;" alt="GDPR" src="https://apify.com/ext/gdpr.png" /></a>`);
    }

    const badgesHtml = badges.length > 0
        ? `<div style="margin-top: 12px;">${badges.join('\n            ')}</div>`
        : '';

    // Generate G2 badge
    const g2Badge = input.shouldDisplayG2
        ? `<div style="display: flex; align-items: center;">
            <a title="Apify is a leader in Small-Business Data Extraction on G2" href="https://www.g2.com/products/apify/reviews?utm_source=rewards-badge">
                <img style="width: 125px;" alt="Apify is a leader in Small-Business Data Extraction on G2" src="https://images.g2crowd.com/uploads/report_medal_translation/image/22071/medal.svg" />
            </a>
        </div>`
        : '';

    // Generate the full signature HTML
    return `
    <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Ubuntu, 'Liberation Sans', Cantarell, 'DejaVu Sans', Oxygen-Sans, 'Noto Sans', 'Open Sans', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Verdana, Arial, sans-serif; font-size: 12px; font-weight: 400;">
        <div style="font-weight: 600; line-height: 18px; color: inherit;">${input.fullName}</div>

        <div style="line-height: 18px; color: inherit;">${input.position}</div>

        <div style="display: flex; align-items: center;">
            <a href="https://apify.com/" style="text-decoration: none;"><img src="https://apify.com/ext/logo-for-signatures-2025.png" alt="Apify" style="margin-top: 12px; width:115px; margin-bottom: 12px;"></a>
        </div>

        ${input.phoneNumber ? `<div style="line-height: 18px; color: inherit;">${input.phoneNumber}</div>` : ""}

        <div style="line-height: 18px;">${urlsHtml}</div>

        ${input.apifyUrl ? `<a href="${sanitizeUrl(input.apifyUrl)}" style="text-decoration: none; color: ${linkColor};"><div style="line-height: 18px;">${input.apifyUrlLabel || 'Apify Profile'}</div></a>` : ""}

        <div style="line-height: 18px; margin-top: 12px;">
            <a href="https://apify.com" style="text-decoration: none; font-weight: 600; color: ${linkColor};">Apify.com</a>

            ${input.shouldDisplayHiring ? ` | <a href="https://apify.com/jobs" style="text-decoration: none; color: ${linkColor};">We're hiring</a>` : ""}
        </div>

        ${badgesHtml}

        ${g2Badge}
    </div>`;
};

// Generate the signature HTML
const signatureHtml = generateSignatureHTML(input);

// Create the test HTML page
const testPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Signature Dark Mode Test</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 20px;
            transition: background-color 0.3s, color 0.3s;
        }

        body.light-mode {
            background-color: #ffffff;
            color: #000000;
        }

        body.dark-mode {
            background-color: #1e1e1e;
            color: #ffffff;
        }

        .controls {
            margin-bottom: 20px;
        }

        button {
            padding: 8px 16px;
            background-color: #4a6da7;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .signature-container {
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 4px;
            max-width: 600px;
        }

        h2 {
            margin-top: 30px;
        }

        .note {
            margin-top: 30px;
            padding: 10px;
            background-color: rgba(255, 255, 0, 0.1);
            border-left: 4px solid #aaaa00;
        }
    </style>
</head>
<body class="light-mode">
    <div class="controls">
        <button id="toggle-mode">Toggle Dark/Light Mode</button>
    </div>

    <h2>Email Signature Preview</h2>
    <div class="signature-container" id="signature-container">
        ${signatureHtml}
    </div>

    <div class="note">
        <p><strong>Note:</strong> This is a simplified test environment. Actual email clients may render the signature differently. The "color: inherit" property we used should adapt to the text color of the email client, whether it's in light or dark mode.</p>
        <p>For thorough testing, you should also test in actual email clients like Gmail, Apple Mail, and Outlook with dark mode enabled.</p>
        <p>The blue color (#6b89c9) chosen for links should be visible in both light and dark modes, though it will have different contrast levels.</p>
    </div>

    <script>
        // Toggle between light and dark mode
        document.getElementById('toggle-mode').addEventListener('click', function() {
            const body = document.body;
            if (body.classList.contains('light-mode')) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
            }
        });
    </script>
</body>
</html>`;

// Write the test page to a file
fs.writeFileSync('dark-mode-test.html', testPageHtml);

console.log('Test page generated: dark-mode-test.html');
console.log('Open this file in your browser to test the signature in light and dark mode.');
