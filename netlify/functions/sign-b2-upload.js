// Placeholder for future B2 Signed Uploads
// Requires: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

exports.handler = async (event) => {
    // TODO: Uncomment and configure when switching to B2
    /*
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
    
    const { key, contentType } = JSON.parse(event.body);
    
    const S3 = new S3Client({
      region: process.env.B2_BUCKET_REGION,
      endpoint: process.env.B2_ENDPOINT_URL,
      credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_KEY_SECRET,
      },
    });
  
    const url = await getSignedUrl(S3, new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME, Key: key, ContentType: contentType
    }), { expiresIn: 3600 });
  
    return { statusCode: 200, body: JSON.stringify({ url, method: "PUT" }) };
    */

    return { statusCode: 501, body: "Not Implemented Yet" };
};
