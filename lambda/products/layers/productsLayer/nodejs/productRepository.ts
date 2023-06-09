import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { v4 as uuid } from "uuid"

export interface Product {
    id: string;
    productName: string;
    code: string;
    price: number;
    model: string
}

export class ProductRepository {
    private dynamoDbClient: DocumentClient
    private productsDdb: string

    constructor(dynamoDbClient: DocumentClient, producsDdb: string) {
        this.dynamoDbClient = dynamoDbClient
        this.productsDdb = producsDdb   
    }

    async getAllProducts(): Promise<Product[]> {
      const data = await this.dynamoDbClient.scan({
            TableName: this.productsDdb
        }).promise()

        return data.Items as Product[]
    }

    async getProductById(productId: string): Promise<Product> {
        const data = await this.dynamoDbClient.get({
            TableName: this.productsDdb,
            Key: {
                id: productId
            }
        }).promise()
        
        if (!data.Item) {
            throw new Error("Product not found")
        }

        return data.Item as Product
    }

    async create(product: Product): Promise<Product> {
        product.id = uuid()
        await this.dynamoDbClient.put({
            TableName: this.productsDdb,
            Item: product
        }).promise()

        return product
    }

    async deleteProduct(productId: string): Promise<Product> {
        const data = await this.dynamoDbClient.delete({
            TableName: this.productsDdb,
            Key: {
                id: productId
            },
            ReturnValues: "ALL_OLD"
        }).promise()

        if (!data.Attributes) {
            throw new Error('Product not foud')
        }   

        return data.Attributes as Product
    }

    async updateProduct(productId: string, product: Product): Promise<Product> {
       const data = await this.dynamoDbClient.update({
            TableName: this.productsDdb,
            Key: {
                id: productId
            },
            ConditionExpression: 'attribute_exists(id)',
            ReturnValues: 'UPDATED_NEW',
            UpdateExpression: 'Set productName = :n, code = :c, price = :p, model = :m',
            ExpressionAttributeValues: {
                ':n': product.productName,
                ':c': product.code,
                ':p': product.price,
                ':m': product.model
            }

        }).promise()

        data.Attributes!.id = productId
        return data.Attributes as Product
    }
}