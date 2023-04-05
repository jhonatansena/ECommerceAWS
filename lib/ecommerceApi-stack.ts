import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import { Stack, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as cwlogs from "aws-cdk-lib/aws-logs"

export class ecommerceApiStack extends Stack {
    
    
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id)

        const api = new apigateway.RestApi(this, "ECommerceApi", {
            restApiName: "ECommerceApi"
        })

    }
}