const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    // DynamoDBの設定
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME;

    // Queryパラメータの設定
    const params = {
        TableName: tableName,
        KeyConditionExpression: 'pk = :pk and sk > :sk',
        ExpressionAttributeValues: {
            ':pk': event.year,
            ':sk': event.monthday,
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
//     "monthday": "0402"
// }

// ■ パーティションキーのみを指定する場合：
// KeyConditionExpression: 'pk = :pk',
// ExpressionAttributeValues: {
//   ':pk': event.yea}
// }

// ■ パーティションキーとソートキーの等しい条件を指定する場合：
// KeyConditionExpression: 'pk = :pk and sk = :sk',
// ExpressionAttributeValues: {
//   ':pk': event.year,
//   ':sk': event.monthday
// }

// ■ パーティションキーの等しい条件とソートキーの範囲条件を指定する場合：
// KeyConditionExpression: 'pk = :pk and sk between :startValue and :endValue',
// ExpressionAttributeValues: {
//   ':pk': event.year,
//   ':startValue': event.monthday,
//   ':endValue': event.monthday
// }

// ■ パーティションキーの等しい条件とソートキーの比較条件を指定する場合：
// KeyConditionExpression: 'pk = :pk and sk > :sk',
// ExpressionAttributeValues: {
//   ':pk': event.year,
//   ':sk': event.monthday
// }
