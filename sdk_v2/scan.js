const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    // DynamoDBの設定
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME;

    // Scan操作のパラメータ
    const params = {
        TableName: tableName,
    };

    try {
        // Scan操作の実行
        const data = await dynamodb.scan(params).promise();
        console.log('Successfully executed Scan');
        console.log('Scan Result:', data.Items);
        return data;
    } catch (err) {
        console.log('Error:', err);
        throw err;
    }
};
