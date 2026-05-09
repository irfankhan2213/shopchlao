#!/bin/bash

STACK_NAME="baseinfrapartnerstack"

DRIFT_ID=$(aws cloudformation detect-stack-drift --stack-name $STACK_NAME | jq -r '.StackDriftDetectionId')
sleep 30
DRIFT_STATUS=$(aws cloudformation describe-stack-drift-detection-status --stack-drift-detection-id $DRIFT_ID | jq -r '.StackDriftStatus')

if [[ $DRIFT_STATUS == IN_SYNC ]]; then 
    echo "##vso[task.setvariable variable=DRIFTED;isOutput=true]false"
    echo "All supported resources are in 'IN_SYNC' status!"
    echo "=============================================================================="
    aws cloudformation describe-stack-resource-drifts --stack-name $STACK_NAME | \
        jq -r '.StackResourceDrifts | map([.StackResourceDriftStatus, .ResourceType] | join(" - ")) | join("\n")'
    echo "=============================================================================="
else
    echo "##vso[task.setvariable variable=DRIFTED;isOutput=true]true"
    echo "Warning! Stack drift status is 'DRIFTED'! Check the resources below."
    echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WARNING!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
    aws cloudformation describe-stack-resource-drifts --stack-name $STACK_NAME | \
        jq -r '.StackResourceDrifts | map([.StackResourceDriftStatus, .ResourceType] | join(" - ")) | join("\n")'
    echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WARNING!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
    echo "Manual Approval required!"
fi