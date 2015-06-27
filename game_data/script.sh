#!/bin/bash
ARRAY=("the wolf _of wall street" "american hustle" "argo" "anchorman" "NBC" "CBS" "comedy central" "AMC" "MTV" "VH1")
CATEGORY="visualmedia"
echo "Category: " ${CATEGORY}
for VAR in "${ARRAY[@]}"
do
python getdata.py "${CATEGORY}" "${VAR}"
echo ${VAR} printed!
done
