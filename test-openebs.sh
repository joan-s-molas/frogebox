#!/bin/bash
set -euo pipefail

echo "[*] Creating test PVC and pod..."

kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: openebs-hostpath
---
apiVersion: v1
kind: Pod
metadata:
  name: pvc-test-pod
spec:
  containers:
    - name: busybox
      image: busybox
      command: [ "sh", "-c", "echo 'hello from openebs' > /mnt/testfile && sleep 3600" ]
      volumeMounts:
        - name: test-vol
          mountPath: /mnt
  volumes:
    - name: test-vol
      persistentVolumeClaim:
        claimName: test-pvc
EOF

echo "[*] Waiting for pod to be ready..."
kubectl wait --for=condition=Ready pod/pvc-test-pod --timeout=60s

echo "[*] Checking if file exists inside the volume..."
kubectl exec pvc-test-pod -- cat /mnt/testfile

echo "[✓] OpenEBS PVC works as expected!"

echo "[*] Cleaning up..."
kubectl delete pod pvc-test-pod
kubectl delete pvc test-pvc

