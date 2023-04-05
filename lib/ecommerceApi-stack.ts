import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import { Stack, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as cwlogs from "aws-cdk-lib/aws-logs"

interface EcommerceApiStackProps extends StackProps {
    productsFetchHandler: lambdaNodeJS.NodejsFunction
}

export class EcommerceApiStack extends Stack {    
    
    constructor(scope: Construct, id: string, props: EcommerceApiStackProps) {
        super(scope, id)

        const api = new apigateway.RestApi(this, "ECommerceApi", {
            restApiName: "ECommerceApi"
        })
    
        const productsFetchIntegration = new apigateway.LambdaIntegration(props.productsFetchHandler)
        const productsResource = api.root.addResource("products")
    }
}