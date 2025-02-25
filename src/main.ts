import generateHTML from './generateHTML';
import { EmailSignatureInput } from './types';
import { Actor } from 'apify';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    await Actor.init();

    try {
        // Try to get input from Apify
        let input: EmailSignatureInput | null = await Actor.getInput() as any;

        // If no input from Apify, try to read from input.json file
        if (!input) {
            console.log('No input from Apify, trying to read from input.json file...');
            try {
                const inputPath = path.join(process.cwd(), 'input.json');
                if (fs.existsSync(inputPath)) {
                    const inputData = fs.readFileSync(inputPath, 'utf8');
                    input = JSON.parse(inputData);
                    console.log('Successfully read input from input.json');
                } else {
                    console.error('input.json file not found at:', inputPath);
                }
            } catch (err) {
                console.error('Error reading input.json:', err);
            }
        }

        // Debug: Log the input
        console.log('Input data:', JSON.stringify(input, null, 2));

        if (!input || !input.fullName || !input.position) {
            throw new Error('Missing required input fields: fullName and position are required');
        }

        const html = generateHTML(input, input.type);

        // Debug: Log a snippet of the generated HTML
        console.log('Generated HTML snippet:', html.substring(0, 200) + '...');

        await Actor.setValue('OUTPUT', html, { 'contentType': 'text/html; charset=utf-8' });

        console.log('Done!');
        console.log('Your email signature can be viewed in the Key-value store under the key "OUTPUT"');
    } finally {
        await Actor.exit();
    }
}

main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
