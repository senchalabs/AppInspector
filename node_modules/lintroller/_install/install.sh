#!/bin/bash

mkdir ../../../hooks
cp check-lint.js ../../../hooks

cp pre-commit ../../../.git/hooks/pre-commit
chmod 777 ../../../.git/hooks/pre-commit