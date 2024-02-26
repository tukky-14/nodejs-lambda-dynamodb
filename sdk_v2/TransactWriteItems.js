const AWS = require('aws-sdk');

exports.handler = async (events, context) => {
    // DynamoDBの設定
    const dynamodb = new AWS.DynamoDB();
    const tableName = process.env.TABLE_NAME;

    // TransactWriteItems操作のリクエストパラメータ
    // 「Put」「Update」「Detele」が指定可能
    const writeOperations = events.map((key) => ({
        Put: {
            TableName: tableName,
            Item: {
                pk: { S: key.year },
                sk: { S: key.month_day },
                diary: { S: key.diary },
                created_at: { N: key.created_at.toString() },
                updated_at: { N: key.updated_at.toString() },
            },
        },
    }));

    // TransactWriteItemsリクエストの作成
    const params = {
        TransactItems: writeOperations,
    };

    try {
        // TransactWriteItems操作の実行
        const data = await dynamodb.transactWriteItems(params).promise();
        console.log('Successfully executed TransactWriteItems');
        console.log('Response:', data);
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
//       "month_day": "0501",
//       "diary": "晴れだった。",
//       "created_at": 20230501000000,
//       "updated_at": 20230501000000
//     },
//     {
//       "year": "2023",
//       "month_day": "0502",
//       "diary": "雨だった。",
//       "created_at": 20230502000000,
//       "updated_at": 20230502000000
//     },
//     {
//       "year": "2023",
//       "month_day": "0503",
//       "diary": "曇りだった。",
//       "created_at": 20230503000000,
//       "updated_at": 20230503000000
//     }
//   ]
