const AWS = require('aws-sdk');

exports.handler = async (event) => {
    // DynamoDBの設定
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME;

    // 更新するデータのキー
    const key = {
        year: event.year,
        month_and_day: event.month_and_day, // テーブルがパーティションキーとソートキーの組み合わせの場合、ソートキーも指定する
    };

    // 更新する項目と値
    const updateExpression = 'set #diary = :newDiary';
    const expressionAttributeValues = {
        ':newDiary': event.diary,
    };
    const expressionAttributeNames = {
        '#diary': 'diary',
    };

    // データを更新
    const params = {
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'ALL_NEW',
    };

    try {
        const result = await dynamodb.update(params).promise();
        const updatedItem = result.Attributes;
        console.log('Update Data:', updatedItem);
        return { statusCode: 200, body: JSON.stringify(updatedItem) };
    } catch (error) {
        console.error('Failed', error);
        return { statusCode: 500, body: 'Error' };
    }
};
