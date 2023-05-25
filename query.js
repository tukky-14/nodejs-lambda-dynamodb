const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    // DynamoDBの設定
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME;

    // Queryパラメータの設定
    const params = {
        TableName: tableName,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
            ':pk': event.year,
        },
    };

    try {
        // Query実行
        const data = await dynamodb.query(params).promise();
        console.log('Query Result:', data.Items);
        return data.Items;
    } catch (err) {
        console.log('Error:', err);
        throw err;
    }
};

// 想定するデータ（event）
// {
//     "year": "2023",
// }
