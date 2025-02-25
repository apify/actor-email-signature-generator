import generateHTML from './generateHTML';
import { EmailSignatureInput } from './types';
import { Actor } from 'apify';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    if (!process.env.APIFY_INPUT_FILE) {
        process.env.APIFY_INPUT_FILE = path.join(process.cwd(), 'input.json');
        console.log('Setting APIFY_INPUT_FILE to:', process.env.APIFY_INPUT_FILE);
    }

    await Actor.init();

    try {
        let input: EmailSignatureInput | null = null;
        const inputPath = path.join(process.cwd(), 'input.json');

        if (fs.existsSync(inputPath)) {
            try {
                const inputData = fs.readFileSync(inputPath, 'utf8');
                input = JSON.parse(inputData);
                console.log('Successfully read input from input.json');
            } catch (err) {
                console.error('Error reading input.json:', err);
            }
        }

        if (!input) {
            input = await Actor.getInput() as any;
            console.log('Got input from Apify');
        }

        console.log('Input data:', JSON.stringify(input, null, 2));

        if (!input?.fullName || !input?.position) {
            throw new Error('Missing required input fields: fullName and position are required');
        }

        const html = generateHTML(input, input.type);

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
