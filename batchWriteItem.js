const AWS = require('aws-sdk');

exports.handler = async (events, context) => {
    // DynamoDBクライアントの作成
    const dynamodb = new AWS.DynamoDB();
    const tableName = process.env.TABLE_NAME;

    // BatchWriteItemリクエストの作成
    const params = {
        RequestItems: {
            [tableName]: events.map((item) => ({
                PutRequest: {
                    Item: {
                        year: { S: item.year },
                        month_and_day: { S: item.month_and_day },
                        diary: { S: item.diary },
                        created_at: { N: item.created_at.toString() },
                        updated_at: { N: item.updated_at.toString() },
                    },
                },
            })),
        },
    };

    try {
        // BatchWriteItemリクエストの実行
        const data = await dynamodb.batchWriteItem(params).promise();
        console.log('Successfully executed BatchWriteItem');
        // 未処理のアイテムがある場合は、UnprocessedItemsに格納される
        console.log('Unprocessed Items:', data.UnprocessedItems);
        return data;
    } catch (err) {
        console.log('Error:', err);
        throw err;
    }
};
