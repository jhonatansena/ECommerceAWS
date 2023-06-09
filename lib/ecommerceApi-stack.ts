import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import { Stack, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as cwlogs from "aws-cdk-lib/aws-logs"

interface EcommerceApiStackProps extends StackProps {
    productsFetchHandler: lambdaNodeJS.NodejsFunction
    productsAdminHandler: lambdaNodeJS.NodejsFunction
}

export class EcommerceApiStack extends Stack {    
    
    constructor(scope: Construct, id: string, props: EcommerceApiStackProps) {
        super(scope, id)
        const logGroup = new cwlogs.LogGroup(this, "ECommerceApiLogs")
        const api = new apigateway.RestApi(this, "ECommerceApi", {
            restApiName: "ECommerceApi",
            cloudWatchRole: true,
            deployOptions: {
                accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
                accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
                    httpMethod: true,
                    ip: true,
                    protocol: true,
                    requestTime: true,
                    resourcePath: true,
                    responseLength: true,
                    status: true,
                    caller: true,
                    user: true,
                })
            }
        })
    
        const productsFetchIntegration = new apigateway.LambdaIntegration(props.productsFetchHandler)
        const productsResource = api.root.addResource("products")

        //GET /products
        productsResource.addMethod("GET", productsFetchIntegration)

        //GET /products/id
        const productIdResource = productsResource.addResource("{id}")
        productIdResource.addMethod("GET", productsFetchIntegration)

        //POST /products
        const productsAdminIntegration = new apigateway.LambdaIntegration(props.productsAdminHandler)
        productsResource.addMethod("POST", productsAdminIntegration)

        //PUT /products/id
        productIdResource.addMethod("PUT", productsAdminIntegration)

        //DELETE /products/id
        productIdResource.addMethod("DELETE", productsAdminIntegration)


    }
}