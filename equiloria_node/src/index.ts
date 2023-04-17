import { KafkaClient, Consumer, Producer, KeyedMessage } from 'kafka-node';
import express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const kafkaClientOptions = {
    kafkaHost: 'localhost:9092',
};

const topic = 'equiloria-topic';

const client = new KafkaClient(kafkaClientOptions);
const consumer = new Consumer(client, [{ topic }], { autoCommit: true });
const producer = new Producer(client);

consumer.on('message', (message) => {
    console.log('Received message:', message);
});

async function sendMessage(message: string) {
    const payload = [
        { topic: topic, messages: [new KeyedMessage('key', message)] }
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
