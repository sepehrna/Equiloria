import {promises} from "dns";

const sendToGoogle = async (uri: string): Promise<void> => {
    if (!uri) {
        console.log("URI is undefined");
        return;
    }

    let base64Img: string = uri;//`data:image/jpg;base64,${uri}`;

    let body = JSON.stringify({
        requests: [
            {
                image: {
                    content: base64Img,
                },
                features: [
                    {type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5},
                ],
            },
        ],
    });

    console.info(body.length);

    const response: Response = await fetch(
        'https://vision.googleapis.com/v1/images:annotate?key=a49e741b87ae4d8dfc5bc23e97a42054e24aaca4',
        {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        console.log(response.text())
        console.log("Failed to fetch from API");
        return;
    }

    const responseJson: any = await response.json();

    if (!responseJson || !responseJson.responses || !responseJson.responses[0]) {
        console.log("API response is not in expected format");
        return;
    }

    console.log('Text detected from image: ', responseJson.responses[0].fullTextAnnotation.text);
};

async function uploadToExtractText(base64Image: string): Promise<void> {
    let response = await fetch('http://10.72.194.161:3000/upload', {
        method: 'POST',
        body: JSON.stringify({base64Image: base64Image}),
        headers: {'Content-Type': 'application/json'},
    });
    console.info(response.json());
}

export {sendToGoogle, uploadToExtractText};