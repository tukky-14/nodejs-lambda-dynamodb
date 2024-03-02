import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import 'dotenv/config';

const dbClient = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'ap-northeast-1',
});

const execute = async (event) => {
    // データを取得するためのクエリパラメータ
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            pk: { S: event.year },
            sk: { S: event.month_day }, // テーブルがパーティションキーとソートキーの組み合わせの場合、ソートキーも指定する
        },
    };

    try {
        const command = new GetItemCommand(params);
        const { Item } = await dbClient.send(command);

        console.log('Item:', Item);
        return { statusCode: 200, body: JSON.stringify(Item) };
    } catch (error) {
        console.error('Failed', error);
        return { statusCode: 500, body: 'Error' };
    }
};

execute({ year: '2023', month_day: '0402' });
