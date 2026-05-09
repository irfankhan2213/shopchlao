#!/usr/bin/env bash
set -euo pipefail
 
# Validate required env vars
: "${AllowedOrigins:?Environment variable AllowedOrigins is required}"
: "${BucketName:?Environment variable BucketName is required}"
: "${ACMCertificateARN:?Environment variable ACMCertificateARN is required}"
: "${Profile:?Environment variable Profile is required}"
 
STACK_NAME=baseinfrapartnerstack
TEMPLATE_FILE=CloudFormation/baseinfrapartner.yaml
AWS_REGION=us-east-2
 
if aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$AWS_REGION" >/dev/null 2>&1; then
  echo "✅ Stack '$STACK_NAME' already exists."
  echo "##vso[task.setvariable variable=STACK_EXISTS;isOutput=true]true"
else
  echo "🚧 Stack '$STACK_NAME' does not exist. Creating now..."
 
  echo "##vso[task.setvariable variable=STACK_EXISTS;isOutput=true]false"
 
  aws cloudformation create-stack \
    --stack-name "$STACK_NAME" \
    --template-body file://"$TEMPLATE_FILE" \
    --parameters \
      ParameterKey=AllowedOrigins,ParameterValue="$AllowedOrigins" \
      ParameterKey=BucketName,ParameterValue="$BucketName" \
      ParameterKey=ACMCertificateARN,ParameterValue="$ACMCertificateARN" \
      ParameterKey=Profile,ParameterValue="$Profile" \
    --capabilities CAPABILITY_NAMED_IAM \
    --region "$AWS_REGION"
fi