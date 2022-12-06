#!/bin/bash

set -e

docker build . -t joanserra/nginx-nonroot:latest
