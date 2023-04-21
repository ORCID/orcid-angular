#!/usr/bin/env bash

# exit on errors
set -o errexit -o errtrace -o nounset -o functrace -o pipefail
shopt -s inherit_errexit 2>/dev/null || true
trap 'sk-catch --exit_code $? --line $LINENO --linecallfunc "$BASH_COMMAND" --funcstack $(printf "::%s" ${FUNCNAME[@]}) -o stdout ' ERR

# import shellkit functions
source shellkit_bootstrap.sh

# defaults
current_dir=`pwd`
checkout_name=$(basename `pwd`)
NAME="$(basename "${0}")"
build_envs="prod sandbox qa int"
tag="v2.0.1"

#
# functions
#

usage(){
I_USAGE="

  Usage: ${NAME} [OPTIONS]

  Description:

    Build orcid-angular war files for each environment


  General usage:

    ${NAME} -t vx.x.x

  Required options:
      -t | --tag         )  tag ($tag)
      -b | --build_envs   )  build environments to use ($build_envs)

"
  echo "$I_USAGE"
  exit

}

#
# args
#

while :
do
  case ${1-default} in
      --*help|-h         )  usage ; exit 0 ;;
      -t | --tag         )  tag=$2; shift 2 ;;
      -b | --build_envs   )  build_envs=$2; shift 2 ;;
      -v | --verbose )       verbose_arg='-v' VERBOSE=$((VERBOSE+1)); shift ;;
      --) shift ; break ;;
      -*) echo "WARN: Unknown option (ignored): $1" >&2 ; shift ;;
      *)  break ;;
    esac
done

sk-arg-check tag

tag_numeric=$(echo "$tag" | tr -dc '[:digit:].')
echo_log "building for: $tag_numeric"

#
# setup build environment from .tool-versions
#

sk-asdf-install-tool-versions
# set JAVA_HOME
. ~/.asdf/plugins/java/set-java-home.bash
_asdf_java_update_java_home

sk-dir-make ~/log

#
# build each build_env
#

for build_env in $build_envs;do
  echo_log "building $build_env"
  build_log_file=~/log/orcid-angular-${build_env}-${tag_numeric}.log

  echo_log "log file: $build_log_file"

  # set the version tag to be -${build_env}-${tag_numeric}
  mvn versions:set -DnewVersion="${tag_numeric}" -DgenerateBackupPoms=false --activate-profiles ${build_env} -Dnodejs.workingDirectory=. --settings settings-custom.xml -l $build_log_file

  # perform the build
  mvnd install --activate-profiles ${build_env} -Dnodejs.workingDirectory=. -DskipTest -l $build_log_file --settings settings-custom.xml

  find . -name '*.war'
done

sk-time-spent

