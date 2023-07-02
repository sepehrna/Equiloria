import {KafkaClient, Consumer, Producer, KeyedMessage} from 'kafka-node';
import express = require('express');
import * as fs from "fs";
import * as Tesseract from "tesseract.js";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 3000;

const kafkaClientOptions = {
    kafkaHost: 'localhost:9092',
};

const topic = 'equiloria-topic';

const client = new KafkaClient(kafkaClientOptions);
const consumer = new Consumer(client, [{topic}], {autoCommit: true});
const producer = new Producer(client);

mongoose.connect('mongodb://localhost:27017/test');
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

    let base64Img: string = picture;

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

app.use(express.json({limit: '50mb'}));

app.post('/upload', async (req, res) => {

    // Get the base64 string from the request body#
    const base64Image = req.body.base64Image;
    console.info('.................................................................');
    // Remove the "data:image/png;base64," part of the string
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // Convert the base64 string back to binary data
    const dataBuffer = Buffer.from(base64Data, 'base64');

    // Write the data to a file
    fs.writeFile('output.png', dataBuffer, (err) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).send('An error occurred: ' + err.message);
        } else {
            console.log('File uploaded successfully');

            // Now that the image is saved, let's perform OCR on it
            Tesseract.recognize('output.png', 'eng', {logger: m => console.log(m)})
                .then(({data: {text}}) => {
                    // Once we have the text, let's try to find the total
                    const lines = text.split('\n');
                    let total;
                    for (let line of lines) {
                        if (line.toLowerCase().includes('total')) {
                            total = line;
                            break;
                        }
                    }
                    //This amount sent due to lack of functionality of expo, ios, windows and, Tesseract learning.
                    total = 1.00;
                    if (total) {
                        // Send the total back to the client
                        res.send({total: total});
                    } else {
                        res.send('No total found');
                    }
                })
                .catch(err => {
                    console.error('Error:', err);
                    res.status(500).send('An error occurred during OCR: ' + err.message);
                });
        }
    });
});



