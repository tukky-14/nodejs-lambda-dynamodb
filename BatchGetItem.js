const AWS = require('aws-sdk');

exports.handler = async (events, context) => {
    // DynamoDBクライアントの作成
    const dynamodb = new AWS.DynamoDB();
    const tableName = process.env.TABLE_NAME;

    // BatchGetItemリクエストの作成
    const params = {
        RequestItems: {
            [tableName]: {
                Keys: events.map((key) => ({
                    pk: { S: key.year },
                    sk: { S: key.month_day },
                })),
            },
        },
    };

    try {
        // BatchGetItemリクエストの実行
        const data = await dynamodb.batchGetItem(params).promise();
        console.log('Successfully executed BatchGetItem');
        console.log('Items:', data.Responses[tableName]);
        return data;
    } catch (err) {
        console.log('Error:', err);
        throw err;
    }
};

// 想定するデータ（events）
// [
//     {
//       "year": "2023",
//       "month_day": "0401",
//       "diary": "晴れだった。",
//       "created_at": 20230401000000,
//       "updated_at": 20230401000000
//     },
//     {
//       "year": "2023",
//       "month_day": "0402",
//       "diary": "雨だった。",
//       "created_at": 20230402000000,
//       "updated_at": 20230402000000
//     },
//     {
//       "year": "2023",
//       "month_day": "0403",
//       "diary": "曇りだった。",
//       "created_at": 20230403000000,
//       "updated_at": 20230403000000
//     }
//   ]
