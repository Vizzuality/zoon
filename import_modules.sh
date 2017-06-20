#!/bin/bash
set -e

TARGET="modules-master"
rm -rf $TARGET master.zip
wget --no-verbose https://github.com/zoonproject/modules/archive/master.zip
unzip -q master
find $TARGET/R -name "*.R" | xargs cat | Rscript ~/R/module2json.R | bin/rake import:modules[-]
rm -rf $TARGET master.zip
