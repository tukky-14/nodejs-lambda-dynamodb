const AWS = require('aws-sdk');

exports.handler = async (event) => {
    // DynamoDBの設定
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME;

    // データを取得するためのクエリパラメータ
    const params = {
        TableName: tableName,
        Key: {
            pk: event.year,
            sk: event.month_day, // テーブルがパーティションキーとソートキーの組み合わせの場合、ソートキーも指定する
        },
    };

    try {
        const data = await dynamodb.get(params).promise();
        const item = data.Item;
        console.log('Data:', item);
        return { statusCode: 200, body: JSON.stringify(item) };
    } catch (error) {
        console.error('Failed', error);
        return { statusCode: 500, body: 'Error' };
    }
};

// 想定するデータ（event）
// {
//     "year": "2023",
//     "month_day": "0401",
// }
