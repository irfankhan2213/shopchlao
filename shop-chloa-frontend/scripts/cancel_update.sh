#!/bin/bash
set -eo pipefail

# Parse command-line arguments for the stack name
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --stack-name) stack_name="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Check if stack_name is set
if [ -z "$stack_name" ]; then
    echo "Stack name is required."
    exit 1
fi

# Check the status of the run
check_result=$(aws cloudformation describe-stacks --stack-name $stack_name)
echo "Checking run status ....."
# Parse out the run status
run_status=$(echo $check_result | jq -r '.Stacks[].StackStatus')
echo "Run status:" $run_status
if [[ "$run_status" == "UPDATE_IN_PROGRESS" ]]; then    
    aws cloudformation cancel-update-stack --stack-name $stack_name
    echo "Canceling ..." 
    sleep_=5
    # Check run result in loop
    continue=1
    while [ $continue -ne 0 ]; do
      updated_check_result=$(aws cloudformation describe-stacks --stack-name $stack_name)
      updated_run_status=$(echo $updated_check_result | jq -r '.Stacks[].StackStatus')
      sleep 10
      if [[ "$updated_run_status" == "UPDATE_ROLLBACK_COMPLETE" ]]; then
        continue=0
        echo "Rollback completed."    
        echo "Finishing job ..."    
        echo "Job succeeded!"     
      elif [[ "$updated_run_status" == "UPDATE_ROLLBACK_IN_PROGRESS" ]]; then
        echo "Rollback in progress ....."
        echo ".........................."
      elif [[ "$updated_run_status" == "UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS" ]]; then
        echo "Rollback completed."
        echo "Cleanup in progress ....."
        echo "........................."
      elif [[ "$updated_run_status" == "UPDATE_ROLLBACK_FAILED" ]]; then
        echo ">>>>>>>>>>>> WARNING! JOB FAILED! <<<<<<<<<<<<<<<<"
        echo "Check CloudFormation Stack before run again."  
        exit 1
      else
        echo "Run Status: " "$updated_run_status"
        echo ">>>>>>>>>>>> WARNING! JOB FAILED! <<<<<<<<<<<<<<<<"
        echo "Unexpected run status. Check CloudFormation Stack!"
        exit 1
      fi
    done
elif [[ "$run_status" == "UPDATE_ROLLBACK_COMPLETE" ]] || [[ "$run_status" == "UPDATE_COMPLETE" ]] || [[ "$run_status" == "CREATE_COMPLETE" ]]; then
        echo "Run Status: " $run_status
        echo 'The job will proccess if stack in "UPDATE_IN_PROGRESS" status only'
        echo "Looks good!"
        echo "The job skipped."
else
        echo "Run Status: " $run_status
        echo ">>>>>>>>>>>> WARNING! JOB FAILED! <<<<<<<<<<<<<<<<"
        echo "Unexpected run status. Check CloudFormation Stack!"
        exit 1
fi