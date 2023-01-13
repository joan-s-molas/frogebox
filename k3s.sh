#!/bin/bash

curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" INSTALL_K3S_EXEC="--flannel-backend none \
    --disable-network-policy \
    --cluster-cidr=10.0.0.0/8 \
    --disable=traefik
    " sh -s -
