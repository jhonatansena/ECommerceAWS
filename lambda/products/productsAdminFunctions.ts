import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDB } from 'aws-sdk'
import { Product, ProductRepository } from "/opt/nodejs/productsLayer";


const productsDdb = process.env.PRODUCTS_DDB!
const ddbClient = new DynamoDB.DocumentClient()

const productRepository = new ProductRepository(ddbClient, productsDdb)

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
            const product = JSON.parse(event.body!) as Product
            const productCreated = await productRepository.create(product)
            return {
                statusCode: code,
                body: JSON.stringify(productCreated)
            }
        }

        if (event.resource === "/products/{id}") {
            const productId = event.pathParameters!.id as string
            let message
            
            if(method === 'PUT') {
            const product = JSON.parse(event.body!)

            try {
                const productUpdated = await productRepository.updateProduct(productId, product)
                message = productUpdated
                code = 204
            } catch (CondicionalCheckException) {
                return {
                    statusCode: 400,
                    body: 'Product not found'
                }
            }
            } 
            
            if (method === 'DELETE') {
             try {
                const product = await productRepository.deleteProduct(productId)
                message = product
                code = 200  
             } catch (error) {
                console.error((<Error>error).message)
                return {
                    statusCode: 400,
                    body: (<Error>error).message
                }
             }
            }
            
            return {
                statusCode: code,
                body: JSON.stringify(message)
            }
        }

        return {
            statusCode: code,
            body: JSON.stringify({
                message: "Bad request"
            })
        }
    }