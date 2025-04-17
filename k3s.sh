#!/bin/bash
set -euo pipefail

# --- CONFIGURATION ---
POD_CIDR="10.10.0.0/16"
CILIUM_VERSION="1.17.3"
K8S_GROUP="k8s-admins"
KUBECONFIG_PATH="/etc/rancher/k3s/k3s.yaml"

echo "[*] Creating group '${K8S_GROUP}' for kubeconfig access..."
if ! getent group "${K8S_GROUP}" > /dev/null; then
    sudo groupadd "${K8S_GROUP}"
    echo "[+] Group '${K8S_GROUP}' created"
else
    echo "[*] Group '${K8S_GROUP}' already exists"
fi

echo "[*] Adding user '$(whoami)' to group '${K8S_GROUP}'..."
sudo usermod -aG "${K8S_GROUP}" "$(whoami)"

if id -nG "$(whoami)" | grep -qw "${K8S_GROUP}"; then
    echo "[*] User '$(whoami)' is already a member of '${K8S_GROUP}'"
    NEED_RELOGIN=0
else
    echo "[*] Adding user '$(whoami)' to group '${K8S_GROUP}'..."
    sudo usermod -aG "${K8S_GROUP}" "$(whoami)"
    NEED_RELOGIN=1
fi

if [[ "${NEED_RELOGIN:-0}" -eq 1 ]]; then
    echo "[!] You’ve been added to the '${K8S_GROUP}' group."
    echo "    Please log out and back in (or restart your terminal session) to use the kubeconfig without sudo."
fi

# --- 1. Install k3s ---
echo "[*] Installing k3s with Pod CIDR ${POD_CIDR} and no Flannel..."
curl -sfL https://get.k3s.io | sudo INSTALL_K3S_EXEC="--flannel-backend=none --disable-network-policy --cluster-cidr=${POD_CIDR}" sh -

echo "[*] Waiting for k3s to be ready..."
sleep 10

echo "[*] Setting group ownership and permissions on ${KUBECONFIG_PATH}..."
sudo chown root:${K8S_GROUP} "${KUBECONFIG_PATH}"
sudo chmod 640 "${KUBECONFIG_PATH}"

export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

mkdir -p "$HOME/.kube"
ln -sf "${KUBECONFIG_PATH}" "$HOME/.kube/config"
echo "[+] Symlinked kubeconfig to ~/.kube/config"

# --- 2. Install Helm (if not installed) ---
if ! command -v helm &> /dev/null; then
    echo "[*] Installing Helm..."
    curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
else
    echo "[*] Helm is already installed"
fi

# --- 3. Install Cilium ---
echo "[*] Adding Cilium Helm repo..."
helm repo add cilium https://helm.cilium.io/
helm repo update

echo "[*] Installing Cilium ${CILIUM_VERSION}..."
helm upgrade -i cilium cilium/cilium \
  --version ${CILIUM_VERSION} \
  --namespace kube-system \
  --set kubeProxyReplacement=true \
  --set k8sServiceHost=127.0.0.1 \
  --set k8sServicePort=6443 \
  --set ipam.mode=kubernetes \
  --set clusterPoolIPv4PodCIDR=${POD_CIDR}

echo "[✓] Cilium installed successfully."

# --- 4. Install OpenEBS Local PV via Helm ---
echo "[*] Adding OpenEBS Helm repo..."
helm repo add openebs https://openebs.github.io/charts
helm repo update

echo "[*] Installing OpenEBS Local PV provisioner via Helm..."
helm upgrade -i openebs openebs/openebs \
  --namespace openebs --create-namespace \
  --set localprovisioner.enabled=true \
  --set nfsProvisioner.enabled=false \
  --set jiva.enabled=false \
  --set cstor.enabled=false \
  --set zfsLocalPV.enabled=false

echo "[*] Creating OpenEBS StorageClass..."

cat <<EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: openebs-hostpath
provisioner: openebs.io/local
volumeBindingMode: WaitForFirstConsumer
EOF

echo "[✓] OpenEBS StorageClass created (openebs-hostpath)"
