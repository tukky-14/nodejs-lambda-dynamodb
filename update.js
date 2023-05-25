const AWS = require('aws-sdk');

exports.handler = async (event) => {
    // DynamoDBの設定
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME;

    // 更新するデータのキー
    const key = {
        pk: event.year,
        sk: event.month_day, // テーブルがパーティションキーとソートキーの組み合わせの場合、ソートキーも指定する
    };

    // 更新する項目と値（set [更新するカラム] = [更新後の値]）
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
        // ■ ReturnValues
        // NONE: 更新操作後に何も返さないことを指定します。
        // ALL_OLD: 更新操作前のアイテムの属性を返します。
        // UPDATED_OLD: 更新操作前のアイテムの属性のうち、更新された属性のみを返します。
        // ALL_NEW: 更新操作後のアイテムの属性を返します。
        // UPDATED_NEW: 更新操作後のアイテムの属性のうち、更新された属性のみを返します。
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
