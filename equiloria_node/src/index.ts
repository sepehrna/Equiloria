import {KafkaClient, Consumer, Producer, KeyedMessage} from 'kafka-node';
import express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const kafkaClientOptions = {
    kafkaHost: 'localhost:9092',
};

const topic = 'equiloria-topic';

const client = new KafkaClient(kafkaClientOptions);
const consumer = new Consumer(client, [{topic}], {autoCommit: true});
const producer = new Producer(client);

consumer.on('message', (message) => {
    console.log('Received message:', message);
});

async function sendMessage(message: string) {
    const payload = [
        {topic: topic, messages: [new KeyedMessage('key', message)]}
    ];

    return new Promise((resolve, reject) => {
        producer.send(payload, (error, result) => {
            if (error) {
                reject(`Failed to send message to Kafka: ${error}`);
            } else {
                resolve(result);
            }
        });
    });
}

app.get('/send', async (req, res) => {
    try {
        await sendMessage('Hello from kafka');
        res.send('Connected to Kafka topic: ' + topic);
        console.log('Sent');
    } catch (error) {
        console.error(`Failed to send message to Kafka: ${error}`);
        res.send('Failed to send message to Kafka');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


app.post('/text-recognition', async (req, res) => {
    let picture = req.body;
    if (!picture) {
        console.log("URI is undefined");
        return;
    }

    let base64Img: string = picture;//`data:image/jpg;base64,${picture}`;

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
});

