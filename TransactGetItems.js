const AWS = require('aws-sdk');

exports.handler = async (events, context) => {
    // DynamoDBの設定
    const dynamodb = new AWS.DynamoDB();
    const tableName = process.env.TABLE_NAME;

    // トランザクション取得オペレーションの配列（複数テーブルの指定が可能）
    const getOperations = events.map((key) => ({
        Get: {
            TableName: tableName,
            Key: {
                pk: { S: key.year },
                sk: { S: key.month_day },
            },
        },
    }));

    // TransactGetItemsリクエストの作成
    const params = {
        TransactItems: getOperations,
    };

    try {
        // TransactGetItemsリクエストの実行
        const data = await dynamodb.transactGetItems(params).promise();
        console.log('Successfully executed TransactGetItems');
        console.log('Items:', data.Responses);
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
