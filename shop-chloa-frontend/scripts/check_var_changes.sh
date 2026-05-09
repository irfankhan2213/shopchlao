#!/bin/bash

STACK_NAME="baseinfrapartnerstack"
RESOURCE_FILTER="Distribution"
MATCH_RESOURCES=0

CHANGESET_ID=$(aws cloudformation list-change-sets --stack-name $STACK_NAME | \
             jq -r '.Summaries | sort_by(.CreationTime) | .[-1].ChangeSetId')

DESCRIBE_CHANGESET=$(aws cloudformation describe-change-set --change-set-name $CHANGESET_ID \
                   --query "Changes[].ResourceChange" | jq -c '.[]')

CHANGESET_LIST=($(echo $DESCRIBE_CHANGESET))

echo "Checking for variable changes..."

if [[ "$DESCRIBE_CHANGESET" != "" ]]; then
    for RESOURCE in "${CHANGESET_LIST[@]}"
    do 
        RESOURCE_TYPE=$(echo $RESOURCE | jq -r '.ResourceType'| grep -o $RESOURCE_FILTER)
        ACTION=$(echo $RESOURCE | jq -r '.Action')
        
        if [[ $RESOURCE_TYPE == $RESOURCE_FILTER ]] && [[ "$ACTION" != "Modify" ]]; then
            MATCH_RESOURCES=$(($MATCH_RESOURCES+1))
        fi
    done
    echo "$MATCH_RESOURCES match(es) for resource '$RESOURCE_FILTER' found."

    if [[ $MATCH_RESOURCES -gt 0 ]]; then
        echo "##vso[task.setvariable variable=VAR_CHANGED;isOutput=true]true"
        echo "The value of the variable is CHANGED"
    else
        echo "##vso[task.setvariable variable=VAR_CHANGED;isOutput=true]false"
        echo "The value of the variable is NOT CHANGED"
    fi
else
    echo "##vso[task.setvariable variable=VAR_CHANGED;isOutput=true]false"
    echo "The value of the variable is NOT CHANGED"
fi
