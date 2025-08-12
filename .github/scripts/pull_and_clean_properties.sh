
#!/bin/bash
# Function to process each .properties file
process_file() {
  local file=$1
  echo "Processing file: $file"
  sed -i.bak -e 's/[[:space:]]*$//' -e 's/[[:space:]]*=[[:space:]]*/=/' "$file"
  rm "${file}.bak"
  echo "Processed file: $file"
}

export -f process_file

# Function to handle tx pull, rename, and delete operations
tx_operations() {
  local lang=$1
  local ext=$2
  
  echo ">>>>>>>>>>>>>>>>>>>>>>> Pulling translations for $lang"
  tx pull --force -l "$lang"
  wait
  find . -type f -name "*.$ext.properties" -delete 
  find . -type f -name "*.$lang.properties" -exec sh -c 'mv "$0" "${0%.'$lang'.properties}.'$ext'.properties"' {} \;
  echo ">>>>>>>>>>>>>>>>>>>>>>> Finished processing $lang files."
}

echo ">>>>>>>>>>>>>>>>>>>>>>> Pulling general translations..."
tx pull --force --all
wait

# Perform tx pull operations for specified languages
tx_operations "tr_TR" "tr"
tx_operations "pl_PL" "pl"

# Find all .properties files and process them
find . -type f -name "*.properties" -exec bash -c 'process_file "$0"' {} \;

# Delete all ca.properties and uk.properties files
find . -type f -name "*.ca.properties" -delete
find . -type f -name "*.uk.properties" -delete

echo ">>>>>>>>>>>>>>>>>>>>>>> Finished processing general files"
