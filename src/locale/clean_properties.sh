#!/bin/bash

# Function to process each .properties file
process_file() {
  local file=$1
  sed -i.bak -e 's/[[:space:]]*$//' -e 's/[[:space:]]*=[[:space:]]*/=/' "$file"
  rm "${file}.bak"
}

export -f process_file

# Find all .properties files and process them
find . -type f -name "*.properties" -exec bash -c 'process_file "$0"' {} \;

echo "Processing complete."