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

    Build orcid-angular war files for each environment and then deploy to and artifact repo

    NOTE: credentials for the artifact repo are sourced from aws secrets but you still need your aws api access to be configured
          secretid is stored in shellkit.conf

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
echo_log "configure build environment for orcid-angular $tag_numeric"

sk-asdf-install-tool-versions
# set JAVA_HOME
. ~/.asdf/plugins/java/set-java-home.bash
_asdf_java_update_java_home

sk-dir-make ~/log

echo $AWS_SECRET_ID
# source the secrets for the artifact uploads
sk-aws-secret-source $AWS_SECRET_ID

echo ${ARTIFACT_URL}${ARTIFACT_REPO_PATH}

export ARTIFACT_USER=$ARTIFACT_USER
export ARTIFACT_PASSWORD=$ARTIFACT_PASSWORD

#
# build each build_env
#

for build_env in $build_envs;do
  echo_log "building $build_env"
  build_log_file=~/log/orcid-angular-${build_env}-${tag_numeric}.log
  echo_log "for build progress see $build_log_file"

  # set the version tag to be -${build_env}-${tag_numeric}
  mvn versions:set -DnewVersion="${tag_numeric}" -DgenerateBackupPoms=false --activate-profiles ${build_env} -Dnodejs.workingDirectory=. -l $build_log_file --settings settings-custom-deploy.xml

  # NOTE: deploy stage performs build as well as deploy
  mvnd --batch-mode \
      --settings settings-custom-deploy.xml \
      --file "pom.xml" \
      -Dmaven.test.skip \
      -DaltReleaseDeploymentRepository=github::${ARTIFACT_URL}${ARTIFACT_REPO_PATH} \
      deploy -Dmaven.test.skip --activate-profiles ${build_env} -Dnodejs.workingDirectory=. -l $build_log_file

done

du -sh ~/.m2/orcid-angular-repo/

sk-time-spent

