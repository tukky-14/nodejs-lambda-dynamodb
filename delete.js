const AWS = require('aws-sdk');

exports.handler = async (event) => {
    // DynamoDBの設定
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME;

    // 削除するデータのキー
    const key = {
        pk: event.year,
        sk: event.month_day, // テーブルがパーティションキーとソートキーの組み合わせの場合、ソートキーも指定する
    };

    // データを削除
    const params = {
        TableName: tableName,
        Key: key,
    };

    try {
        await dynamodb.delete(params).promise();
        console.log('Success!!');
        return { statusCode: 200, body: 'Success' };
    } catch (error) {
        console.error('Failed: ', error);
        return { statusCode: 500, body: 'Error' };
    }
};
