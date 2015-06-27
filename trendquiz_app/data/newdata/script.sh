#!/bin/bash
ARRAY=("masters" "us open" "pga championship" "wimbledon" "steroids" "alex rodriguez" "barry bonds")
CATEGORY="sports"
echo "Category: " ${CATEGORY}
for VAR in "${ARRAY[@]}"
do
python getdata.py "${CATEGORY}" "${VAR}"
echo ${VAR} printed!
done
