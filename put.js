const AWS = require('aws-sdk');

exports.handler = async (event) => {
    // DynamoDBの設定
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME;

    // 登録するデータ
    const item = {
        year: event.year,
        month_and_day: event.month_and_day,
        diary: event.diary,
        created_at: event.create_at,
        updated_at: event.updated_at,
    };

    // DynamoDBにデータを登録
    const params = {
        TableName: tableName,
        Item: item,
    };

    try {
        await dynamodb.put(params).promise();
        console.log('Success!!');
        return { statusCode: 200, body: 'Success' };
    } catch (error) {
        console.error('Failed: ', error);
        return { statusCode: 500, body: 'Error' };
    }
};
