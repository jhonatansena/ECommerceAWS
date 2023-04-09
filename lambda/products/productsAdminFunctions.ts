import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent, 
    context: Context): Promise<APIGatewayProxyResult> {
        
        const lambdaRequestId = context.awsRequestId
        const apiRequestId = event.requestContext.requestId
        
        console.log(`API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`)
        const method = event.httpMethod
        let code = 400

        if (event.resource === "/products") {
            console.log('POST /products')
            code = 201

            return {
                statusCode: code,
                body: JSON.stringify({
                    message: "POST /products - OK"
                })
            }
        }

        if (event.resource === "/products/{id}") {
            const productId = event.pathParameters!.id as string
            let message
            
            if(method === 'PUT') {
             message = "PUT /products/{id} - OK"
             code = 204
            } 
            
            if (method === 'DELETE') {
              message = "DELTE /products/{id} - OK"
              code = 200  
            }

            
            return {
                statusCode: code,
                body: JSON.stringify({
                    message
                })
            }
        }

        return {
            statusCode: code,
            body: JSON.stringify({
                message: "Bad request"
            })
        }
    }