import generateHTML from './generateHTML';
import { EmailSignatureInput } from './types';
const Apify = require('apify');

Apify.main(async () => {
    const input: EmailSignatureInput = (await Apify.getInput()) as any;
    await Apify.setValue('OUTPUT', generateHTML(input, input.type), {'contentType': 'text/html; charset=utf-8'});
    console.log('Done!');
    console.log('Your email signature can be viewed in the Key-value store under the key "OUTPUT"');
});
