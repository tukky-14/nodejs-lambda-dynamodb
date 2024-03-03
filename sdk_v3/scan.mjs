import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import 'dotenv/config';

const dbClient = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'ap-northeast-1',
});

const execute = async () => {
    // データを取得するためのクエリパラメータ
    const params = {
        TableName: process.env.TABLE_NAME,
    };

    try {
        const command = new ScanCommand(params);
        const { Items } = await dbClient.send(command);

        console.log('Items:', Items);
        return { statusCode: 200, body: JSON.stringify(Items) };
    } catch (error) {
        console.error('Failed', error);
        return { statusCode: 500, body: 'Error' };
    }
};

execute();
